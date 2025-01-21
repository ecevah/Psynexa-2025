const { Sequelize, Op } = require("sequelize");
const { Reservation, Client, Psychologist, Payment } = require("../models");
const logger = require("../config/logger");

class ReservationController {
  // Yeni rezervasyon oluştur
  async createReservation(req, res) {
    try {
      const { psyc_id, date, start_time, end_time, description } = req.body;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar rezervasyon oluşturabilir",
        });
      }

      // Zorunlu alan kontrolü
      if (!psyc_id || !date || !start_time || !end_time) {
        return res.status(400).json({
          status: false,
          message: "Psikolog, tarih ve saat bilgileri zorunludur",
        });
      }

      // Psikolog kontrolü
      const psychologist = await Psychologist.findByPk(psyc_id);
      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
        });
      }

      // Tarih kontrolü
      const reservationDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reservationDate < today) {
        return res.status(400).json({
          status: false,
          message: "Geçmiş bir tarih için rezervasyon oluşturamazsınız",
        });
      }

      // Saat çakışması kontrolü
      const existingReservation = await Reservation.findOne({
        where: {
          psyc_id,
          date,
          status: {
            [Op.notIn]: ["cancelled"],
          },
          [Op.or]: [
            {
              [Op.and]: [
                { start_time: { [Op.lte]: start_time } },
                { end_time: { [Op.gt]: start_time } },
              ],
            },
            {
              [Op.and]: [
                { start_time: { [Op.lt]: end_time } },
                { end_time: { [Op.gte]: end_time } },
              ],
            },
          ],
        },
      });

      if (existingReservation) {
        return res.status(400).json({
          status: false,
          message: "Seçilen zaman dilimi dolu",
        });
      }

      // Başlangıç saati bitiş saatinden önce olmalı
      if (start_time >= end_time) {
        return res.status(400).json({
          status: false,
          message: "Başlangıç saati bitiş saatinden önce olmalıdır",
        });
      }

      const reservation = await Reservation.create({
        client_id,
        psyc_id,
        date,
        start_time,
        end_time,
        description,
        status: "pending",
        pay_status: "pending",
        created_by: client_id,
      });

      logger.info(`Yeni rezervasyon oluşturuldu: ${reservation.id}`);
      res.status(201).json({
        status: true,
        message: "Rezervasyon başarıyla oluşturuldu",
        data: reservation,
      });
    } catch (error) {
      logger.error(`Rezervasyon oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyon oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Tüm rezervasyonları getir (Psikolog için)
  async getPsychologistReservations(req, res) {
    try {
      const psyc_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const reservations = await Reservation.findAll({
        where: { psyc_id },
        include: [
          {
            model: Client,
            as: "client",
            attributes: ["id", "name", "surname", "email", "phone"],
          },
          {
            model: Payment,
            as: "payment",
            attributes: ["id", "amount", "status"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["start_time", "ASC"],
        ],
      });

      res.json({
        status: true,
        message: "Rezervasyonlar başarıyla getirildi",
        data: reservations,
      });
    } catch (error) {
      logger.error(`Rezervasyon listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyonlar alınamadı",
        error: error.message,
      });
    }
  }

  // Danışanın rezervasyonlarını getir
  async getClientReservations(req, res) {
    try {
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const reservations = await Reservation.findAll({
        where: { client_id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname", "email", "phone", "image"],
          },
          {
            model: Payment,
            as: "payment",
            attributes: ["id", "amount", "status"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["start_time", "ASC"],
        ],
      });

      res.json({
        status: true,
        message: "Rezervasyonlar başarıyla getirildi",
        data: reservations,
      });
    } catch (error) {
      logger.error(`Rezervasyon listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyonlar alınamadı",
        error: error.message,
      });
    }
  }

  // Rezervasyon detayı
  async getReservation(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      // Yetki kontrolü
      if (!["client", "psychologist"].includes(user_type)) {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({
        where: whereClause,
        include: [
          {
            model: Client,
            as: "client",
            attributes: ["id", "name", "surname", "email", "phone"],
          },
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname", "email", "phone", "image"],
          },
          {
            model: Payment,
            as: "payment",
            attributes: ["id", "amount", "status"],
          },
        ],
      });

      if (!reservation) {
        return res.status(404).json({
          status: false,
          message: "Rezervasyon bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Rezervasyon detayı başarıyla getirildi",
        data: reservation,
      });
    } catch (error) {
      logger.error(`Rezervasyon detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyon detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Rezervasyon güncelle
  async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const { status, pay_status, date, start_time, end_time, description } =
        req.body;
      const user_id = req.user.id;
      const user_type = req.user.type;

      // Yetki kontrolü
      if (!["client", "psychologist"].includes(user_type)) {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({ where: whereClause });

      if (!reservation) {
        return res.status(404).json({
          status: false,
          message: "Rezervasyon bulunamadı",
        });
      }

      // Sadece psikoloğun güncelleyebileceği alanlar
      if (user_type === "psychologist") {
        if (status) reservation.status = status;
        if (pay_status) reservation.pay_status = pay_status;
      }

      // Ortak güncellenebilir alanlar
      if (date) reservation.date = date;
      if (start_time) reservation.start_time = start_time;
      if (end_time) reservation.end_time = end_time;
      if (description) reservation.description = description;

      reservation.updated_by = user_id;
      await reservation.save();

      logger.info(`Rezervasyon güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Rezervasyon başarıyla güncellendi",
        data: reservation,
      });
    } catch (error) {
      logger.error(`Rezervasyon güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyon güncellenemedi",
        error: error.message,
      });
    }
  }

  // Rezervasyon iptal et
  async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      // Yetki kontrolü
      if (!["client", "psychologist"].includes(user_type)) {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({ where: whereClause });

      if (!reservation) {
        return res.status(404).json({
          status: false,
          message: "Rezervasyon bulunamadı",
        });
      }

      // Tamamlanmış rezervasyonlar iptal edilemez
      if (reservation.status === "completed") {
        return res.status(400).json({
          status: false,
          message: "Tamamlanmış rezervasyonlar iptal edilemez",
        });
      }

      await reservation.update({
        status: "cancelled",
        updated_by: user_id,
      });

      logger.info(`Rezervasyon iptal edildi: ${id}`);
      res.json({
        status: true,
        message: "Rezervasyon başarıyla iptal edildi",
      });
    } catch (error) {
      logger.error(`Rezervasyon iptal hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Rezervasyon iptal edilemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new ReservationController();

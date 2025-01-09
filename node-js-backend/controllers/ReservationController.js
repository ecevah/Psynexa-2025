const { Reservation, Client, Psychologist } = require("../models");
const logger = require("../config/logger");

class ReservationController {
  // Yeni rezervasyon oluştur
  async createReservation(req, res) {
    try {
      const { psyc_id, date, time, description } = req.body;
      const client_id = req.user.id;

      const reservation = await Reservation.create({
        client_id,
        psyc_id,
        date,
        time,
        description,
        created_by: client_id,
      });

      logger.info(`Yeni rezervasyon oluşturuldu: ${reservation.id}`);
      res.status(201).json(reservation);
    } catch (error) {
      logger.error(`Rezervasyon oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyon oluşturulamadı" });
    }
  }

  // Tüm rezervasyonları getir (Psikolog için)
  async getPsychologistReservations(req, res) {
    try {
      const psyc_id = req.user.id;
      const reservations = await Reservation.findAll({
        where: { psyc_id },
        include: [
          {
            model: Client,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["time", "ASC"],
        ],
      });

      res.json(reservations);
    } catch (error) {
      logger.error(`Rezervasyon listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyonlar alınamadı" });
    }
  }

  // Danışanın rezervasyonlarını getir
  async getClientReservations(req, res) {
    try {
      const client_id = req.user.id;
      const reservations = await Reservation.findAll({
        where: { client_id },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name", "email"],
          },
        ],
        order: [
          ["date", "DESC"],
          ["time", "ASC"],
        ],
      });

      res.json(reservations);
    } catch (error) {
      logger.error(`Rezervasyon listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyonlar alınamadı" });
    }
  }

  // Rezervasyon detayı
  async getReservation(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({
        where: whereClause,
        include: [
          {
            model: Client,
            attributes: ["id", "name", "email"],
          },
          {
            model: Psychologist,
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!reservation) {
        return res.status(404).json({ error: "Rezervasyon bulunamadı" });
      }

      res.json(reservation);
    } catch (error) {
      logger.error(`Rezervasyon detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyon detayı alınamadı" });
    }
  }

  // Rezervasyon güncelle
  async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const { status, pay_status, date, time, description } = req.body;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({ where: whereClause });

      if (!reservation) {
        return res.status(404).json({ error: "Rezervasyon bulunamadı" });
      }

      await reservation.update({
        status,
        pay_status,
        date,
        time,
        description,
        updated_by: user_id,
      });

      logger.info(`Rezervasyon güncellendi: ${id}`);
      res.json(reservation);
    } catch (error) {
      logger.error(`Rezervasyon güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyon güncellenemedi" });
    }
  }

  // Rezervasyon iptal et
  async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const reservation = await Reservation.findOne({ where: whereClause });

      if (!reservation) {
        return res.status(404).json({ error: "Rezervasyon bulunamadı" });
      }

      await reservation.update({
        status: "cancelled",
        updated_by: user_id,
      });

      logger.info(`Rezervasyon iptal edildi: ${id}`);
      res.json({ message: "Rezervasyon başarıyla iptal edildi" });
    } catch (error) {
      logger.error(`Rezervasyon iptal hatası: ${error.message}`);
      res.status(500).json({ error: "Rezervasyon iptal edilemedi" });
    }
  }
}

module.exports = new ReservationController();

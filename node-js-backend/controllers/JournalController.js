const { Journal } = require("../models");
const logger = require("../config/logger");

class JournalController {
  // Yeni günlük oluştur
  async createJournal(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar günlük oluşturabilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar günlük oluşturabilir",
        });
      }

      const { title, content, date, mood } = req.body;

      const journal = await Journal.create({
        client_id: user.id,
        title,
        content,
        date,
        mood,
        status: "private",
        created_by: user.id,
      });

      logger.info(`Yeni günlük oluşturuldu: ${journal.id}`);
      res.status(201).json({
        status: true,
        message: "Günlük başarıyla oluşturuldu",
        data: journal,
      });
    } catch (error) {
      logger.error(`Günlük oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlük oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Günlükleri getir
  async getJournals(req, res) {
    try {
      const user = req.user;
      let where = {};

      // Kullanıcı tipine göre filtreleme
      if (user.type === "client") {
        // Danışan sadece kendi günlüklerini görebilir
        where.client_id = user.id;
      } else if (user.type === "psychologist") {
        // Psikolog sadece kendisiyle paylaşılan günlükleri görebilir
        where.status = "shared_with_psychologist";
      } else {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const journals = await Journal.findAll({
        where,
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Günlükler başarıyla getirildi",
        data: journals,
      });
    } catch (error) {
      logger.error(`Günlük listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlükler alınamadı",
        error: error.message,
      });
    }
  }

  // Günlük detayı
  async getJournal(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const journal = await Journal.findOne({
        where:
          user.type === "client"
            ? { id, client_id: user.id }
            : { id, status: "shared_with_psychologist" },
      });

      if (!journal) {
        return res.status(404).json({
          status: false,
          message: "Günlük bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Günlük başarıyla getirildi",
        data: journal,
      });
    } catch (error) {
      logger.error(`Günlük detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlük detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Günlük güncelle
  async updateJournal(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar günlük güncelleyebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar günlük güncelleyebilir",
        });
      }

      const { title, content, date, mood } = req.body;

      const journal = await Journal.findOne({
        where: { id, client_id: user.id },
      });

      if (!journal) {
        return res.status(404).json({
          status: false,
          message: "Günlük bulunamadı",
        });
      }

      await journal.update({
        title,
        content,
        date,
        mood,
        updated_by: user.id,
      });

      logger.info(`Günlük güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Günlük başarıyla güncellendi",
        data: journal,
      });
    } catch (error) {
      logger.error(`Günlük güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlük güncellenemedi",
        error: error.message,
      });
    }
  }

  // Günlük sil
  async deleteJournal(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar günlük silebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar günlük silebilir",
        });
      }

      const journal = await Journal.findOne({
        where: { id, client_id: user.id },
      });

      if (!journal) {
        return res.status(404).json({
          status: false,
          message: "Günlük bulunamadı",
        });
      }

      await journal.destroy();

      logger.info(`Günlük silindi: ${id}`);
      res.json({
        status: true,
        message: "Günlük başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Günlük silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlük silinemedi",
        error: error.message,
      });
    }
  }

  // Günlük paylaş/gizle
  async toggleShareJournal(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar günlük paylaşabilir/gizleyebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar günlük paylaşabilir/gizleyebilir",
        });
      }

      const journal = await Journal.findOne({
        where: { id, client_id: user.id },
      });

      if (!journal) {
        return res.status(404).json({
          status: false,
          message: "Günlük bulunamadı",
        });
      }

      const newStatus =
        journal.status === "private" ? "shared_with_psychologist" : "private";

      await journal.update({
        status: newStatus,
        updated_by: user.id,
      });

      logger.info(`Günlük durumu güncellendi: ${id} -> ${newStatus}`);
      res.json({
        status: true,
        message: `Günlük ${newStatus === "private" ? "gizli" : "paylaşıldı"}`,
        data: journal,
      });
    } catch (error) {
      logger.error(`Günlük paylaşma/gizleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Günlük durumu güncellenemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new JournalController();

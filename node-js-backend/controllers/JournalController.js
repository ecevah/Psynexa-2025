const { Journal } = require("../models");
const logger = require("../config/logger");

class JournalController {
  // Yeni günlük oluştur
  async createJournal(req, res) {
    try {
      const client_id = req.user.id;
      const { content, date, emotion } = req.body;

      const journal = await Journal.create({
        client_id,
        content,
        date,
        emotion,
        created_by: client_id,
      });

      logger.info(`Yeni günlük oluşturuldu: ${journal.id}`);
      res.status(201).json(journal);
    } catch (error) {
      logger.error(`Günlük oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Günlük oluşturulamadı" });
    }
  }

  // Danışanın günlüklerini getir
  async getJournals(req, res) {
    try {
      const client_id = req.user.id;
      const journals = await Journal.findAll({
        where: { client_id, status: "active" },
        order: [["date", "DESC"]],
      });

      res.json(journals);
    } catch (error) {
      logger.error(`Günlük listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Günlükler alınamadı" });
    }
  }

  // Günlük detayı
  async getJournal(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const journal = await Journal.findOne({
        where: { id, client_id },
      });

      if (!journal) {
        return res.status(404).json({ error: "Günlük bulunamadı" });
      }

      res.json(journal);
    } catch (error) {
      logger.error(`Günlük detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Günlük detayı alınamadı" });
    }
  }

  // Günlük güncelle
  async updateJournal(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const { content, date, emotion } = req.body;

      const journal = await Journal.findOne({
        where: { id, client_id },
      });

      if (!journal) {
        return res.status(404).json({ error: "Günlük bulunamadı" });
      }

      await journal.update({
        content,
        date,
        emotion,
        updated_by: client_id,
      });

      logger.info(`Günlük güncellendi: ${id}`);
      res.json(journal);
    } catch (error) {
      logger.error(`Günlük güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Günlük güncellenemedi" });
    }
  }

  // Günlük sil
  async deleteJournal(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const journal = await Journal.findOne({
        where: { id, client_id },
      });

      if (!journal) {
        return res.status(404).json({ error: "Günlük bulunamadı" });
      }

      await journal.update({
        status: "deleted",
        updated_by: client_id,
      });

      logger.info(`Günlük silindi: ${id}`);
      res.json({ message: "Günlük başarıyla silindi" });
    } catch (error) {
      logger.error(`Günlük silme hatası: ${error.message}`);
      res.status(500).json({ error: "Günlük silinemedi" });
    }
  }

  // Günlük arşivle
  async archiveJournal(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const journal = await Journal.findOne({
        where: { id, client_id },
      });

      if (!journal) {
        return res.status(404).json({ error: "Günlük bulunamadı" });
      }

      await journal.update({
        status: "archived",
        updated_by: client_id,
      });

      logger.info(`Günlük arşivlendi: ${id}`);
      res.json({ message: "Günlük başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Günlük arşivleme hatası: ${error.message}`);
      res.status(500).json({ error: "Günlük arşivlenemedi" });
    }
  }
}

module.exports = new JournalController();

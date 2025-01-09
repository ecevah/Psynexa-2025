const { Reminder } = require("../models");
const logger = require("../config/logger");

class ReminderController {
  // Yeni hatırlatıcı oluştur
  async createReminder(req, res) {
    try {
      const client_id = req.user.id;
      const { reminder_time, content, title, frequency } = req.body;

      const reminder = await Reminder.create({
        client_id,
        reminder_time,
        content,
        title,
        frequency,
        created_by: client_id,
      });

      logger.info(`Yeni hatırlatıcı oluşturuldu: ${reminder.id}`);
      res.status(201).json(reminder);
    } catch (error) {
      logger.error(`Hatırlatıcı oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcı oluşturulamadı" });
    }
  }

  // Danışanın hatırlatıcılarını getir
  async getReminders(req, res) {
    try {
      const client_id = req.user.id;
      const reminders = await Reminder.findAll({
        where: { client_id, active: true },
        order: [["reminder_time", "ASC"]],
      });

      res.json(reminders);
    } catch (error) {
      logger.error(`Hatırlatıcı listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcılar alınamadı" });
    }
  }

  // Hatırlatıcı detayı
  async getReminder(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const reminder = await Reminder.findOne({
        where: { id, client_id },
      });

      if (!reminder) {
        return res.status(404).json({ error: "Hatırlatıcı bulunamadı" });
      }

      res.json(reminder);
    } catch (error) {
      logger.error(`Hatırlatıcı detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcı detayı alınamadı" });
    }
  }

  // Hatırlatıcı güncelle
  async updateReminder(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const { reminder_time, content, title, frequency, active, status } =
        req.body;

      const reminder = await Reminder.findOne({
        where: { id, client_id },
      });

      if (!reminder) {
        return res.status(404).json({ error: "Hatırlatıcı bulunamadı" });
      }

      await reminder.update({
        reminder_time,
        content,
        title,
        frequency,
        active,
        status,
        updated_by: client_id,
      });

      logger.info(`Hatırlatıcı güncellendi: ${id}`);
      res.json(reminder);
    } catch (error) {
      logger.error(`Hatırlatıcı güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcı güncellenemedi" });
    }
  }

  // Hatırlatıcı sil
  async deleteReminder(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const reminder = await Reminder.findOne({
        where: { id, client_id },
      });

      if (!reminder) {
        return res.status(404).json({ error: "Hatırlatıcı bulunamadı" });
      }

      await reminder.update({
        active: false,
        status: "cancelled",
        updated_by: client_id,
      });

      logger.info(`Hatırlatıcı silindi: ${id}`);
      res.json({ message: "Hatırlatıcı başarıyla silindi" });
    } catch (error) {
      logger.error(`Hatırlatıcı silme hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcı silinemedi" });
    }
  }

  // Hatırlatıcıyı tamamla
  async completeReminder(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const reminder = await Reminder.findOne({
        where: { id, client_id },
      });

      if (!reminder) {
        return res.status(404).json({ error: "Hatırlatıcı bulunamadı" });
      }

      await reminder.update({
        status: "completed",
        updated_by: client_id,
      });

      logger.info(`Hatırlatıcı tamamlandı: ${id}`);
      res.json({ message: "Hatırlatıcı başarıyla tamamlandı" });
    } catch (error) {
      logger.error(`Hatırlatıcı tamamlama hatası: ${error.message}`);
      res.status(500).json({ error: "Hatırlatıcı tamamlanamadı" });
    }
  }
}

module.exports = new ReminderController();

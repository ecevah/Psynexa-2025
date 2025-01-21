const { Reminder } = require("../models");
const logger = require("../config/logger");

class ReminderController {
  // Yeni hatırlatıcı oluştur
  async createReminder(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar hatırlatıcı oluşturabilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcı oluşturabilir",
        });
      }

      const { reminder_time, content, title, frequency } = req.body;

      const reminder = await Reminder.create({
        client_id: user.id,
        reminder_time,
        content,
        title,
        frequency,
        created_by: user.id,
      });

      logger.info(`Yeni hatırlatıcı oluşturuldu: ${reminder.id}`);
      res.status(201).json({
        status: true,
        message: "Hatırlatıcı başarıyla oluşturuldu",
        data: reminder,
      });
    } catch (error) {
      logger.error(`Hatırlatıcı oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcı oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Danışanın hatırlatıcılarını getir
  async getReminders(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar hatırlatıcıları görebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcıları görebilir",
        });
      }

      const reminders = await Reminder.findAll({
        where: { client_id: user.id, active: true },
        order: [["reminder_time", "ASC"]],
      });

      res.json({
        status: true,
        message: "Hatırlatıcılar başarıyla getirildi",
        data: reminders,
      });
    } catch (error) {
      logger.error(`Hatırlatıcı listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcılar alınamadı",
        error: error.message,
      });
    }
  }

  // Hatırlatıcı detayı
  async getReminder(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar hatırlatıcı detayını görebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcı detayını görebilir",
        });
      }

      const reminder = await Reminder.findOne({
        where: { id, client_id: user.id },
      });

      if (!reminder) {
        return res.status(404).json({
          status: false,
          message: "Hatırlatıcı bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Hatırlatıcı detayı başarıyla getirildi",
        data: reminder,
      });
    } catch (error) {
      logger.error(`Hatırlatıcı detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcı detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Hatırlatıcı güncelle
  async updateReminder(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar hatırlatıcı güncelleyebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcı güncelleyebilir",
        });
      }

      const { reminder_time, content, title, frequency, active, status } =
        req.body;

      const reminder = await Reminder.findOne({
        where: { id, client_id: user.id },
      });

      if (!reminder) {
        return res.status(404).json({
          status: false,
          message: "Hatırlatıcı bulunamadı",
        });
      }

      await reminder.update({
        reminder_time,
        content,
        title,
        frequency,
        active,
        status,
        updated_by: user.id,
      });

      logger.info(`Hatırlatıcı güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Hatırlatıcı başarıyla güncellendi",
        data: reminder,
      });
    } catch (error) {
      logger.error(`Hatırlatıcı güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcı güncellenemedi",
        error: error.message,
      });
    }
  }

  // Hatırlatıcı sil
  async deleteReminder(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar hatırlatıcı silebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcı silebilir",
        });
      }

      const reminder = await Reminder.findOne({
        where: { id, client_id: user.id },
      });

      if (!reminder) {
        return res.status(404).json({
          status: false,
          message: "Hatırlatıcı bulunamadı",
        });
      }

      await reminder.update({
        active: false,
        status: "cancelled",
        updated_by: user.id,
      });

      logger.info(`Hatırlatıcı silindi: ${id}`);
      res.json({
        status: true,
        message: "Hatırlatıcı başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Hatırlatıcı silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcı silinemedi",
        error: error.message,
      });
    }
  }

  // Hatırlatıcıyı tamamla
  async completeReminder(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar hatırlatıcı tamamlayabilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar hatırlatıcı tamamlayabilir",
        });
      }

      const reminder = await Reminder.findOne({
        where: { id, client_id: user.id },
      });

      if (!reminder) {
        return res.status(404).json({
          status: false,
          message: "Hatırlatıcı bulunamadı",
        });
      }

      await reminder.update({
        status: "completed",
        updated_by: user.id,
      });

      logger.info(`Hatırlatıcı tamamlandı: ${id}`);
      res.json({
        status: true,
        message: "Hatırlatıcı başarıyla tamamlandı",
        data: reminder,
      });
    } catch (error) {
      logger.error(`Hatırlatıcı tamamlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Hatırlatıcı tamamlanamadı",
        error: error.message,
      });
    }
  }
}

module.exports = new ReminderController();

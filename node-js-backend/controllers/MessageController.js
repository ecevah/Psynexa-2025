const { Message } = require("../models");
const logger = require("../config/logger");

class MessageController {
  // Mesaj gönderme
  async sendMessage(req, res) {
    try {
      const { text, type } = req.body;
      const client_id = req.user.id;

      const message = await Message.create({
        client_id,
        text,
        type,
        status: "sent",
      });

      logger.info(`Yeni mesaj gönderildi: ${message.id}`);
      res.status(201).json(message);
    } catch (error) {
      logger.error(`Mesaj gönderme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj gönderilemedi" });
    }
  }

  // Mesaj listesi
  async getMessages(req, res) {
    try {
      const client_id = req.user.id;
      const messages = await Message.findAll({
        where: { client_id },
        order: [["created_at", "DESC"]],
      });

      res.json(messages);
    } catch (error) {
      logger.error(`Mesaj listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Mesajlar alınamadı" });
    }
  }

  // Mesaj detayı
  async getMessage(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const message = await Message.findOne({
        where: { id, client_id },
      });

      if (!message) {
        return res.status(404).json({ error: "Mesaj bulunamadı" });
      }

      // Mesaj okundu olarak işaretle
      if (message.status !== "read") {
        await message.update({ status: "read" });
      }

      res.json(message);
    } catch (error) {
      logger.error(`Mesaj detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj detayı alınamadı" });
    }
  }

  // Mesaj yanıtlama (Psikolog için)
  async respondToMessage(req, res) {
    try {
      const { id } = req.params;
      const { response } = req.body;

      const message = await Message.findByPk(id);

      if (!message) {
        return res.status(404).json({ error: "Mesaj bulunamadı" });
      }

      await message.update({
        response,
        status: "delivered",
      });

      logger.info(`Mesaj yanıtlandı: ${id}`);
      res.json(message);
    } catch (error) {
      logger.error(`Mesaj yanıtlama hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj yanıtlanamadı" });
    }
  }

  // Mesaj silme
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const message = await Message.findOne({
        where: { id, client_id },
      });

      if (!message) {
        return res.status(404).json({ error: "Mesaj bulunamadı" });
      }

      await message.destroy();
      logger.info(`Mesaj silindi: ${id}`);
      res.json({ message: "Mesaj başarıyla silindi" });
    } catch (error) {
      logger.error(`Mesaj silme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj silinemedi" });
    }
  }
}

module.exports = new MessageController();

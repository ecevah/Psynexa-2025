const { Message, Psychologist } = require("../models");
const logger = require("../config/logger");

class MessageController {
  // Mesaj gönderme
  async sendMessage(req, res) {
    try {
      const { content, type = "text", psyc_id } = req.body;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar mesaj gönderebilir",
        });
      }

      // Zorunlu alan kontrolü
      if (!content) {
        return res.status(400).json({
          status: false,
          message: "Mesaj içeriği zorunludur",
        });
      }

      // Psikolog kontrolü
      if (psyc_id) {
        const psychologist = await Psychologist.findByPk(psyc_id);
        if (!psychologist) {
          return res.status(404).json({
            status: false,
            message: "Psikolog bulunamadı",
          });
        }
      }

      const message = await Message.create({
        client_id,
        psyc_id,
        content,
        type,
        status: "sent",
      });

      logger.info(`Yeni mesaj gönderildi: ${message.id}`);
      res.status(201).json({
        status: true,
        message: "Mesaj başarıyla gönderildi",
        data: message,
      });
    } catch (error) {
      logger.error(`Mesaj gönderme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Mesaj gönderilemedi",
        error: error.message,
      });
    }
  }

  // Mesaj listesi
  async getMessages(req, res) {
    try {
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar mesajlarını görebilir",
        });
      }

      const messages = await Message.findAll({
        where: { client_id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname", "image"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Mesajlar başarıyla getirildi",
        data: messages,
      });
    } catch (error) {
      logger.error(`Mesaj listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Mesajlar alınamadı",
        error: error.message,
      });
    }
  }

  // Mesaj detayı
  async getMessage(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar mesajlarını görebilir",
        });
      }

      const message = await Message.findOne({
        where: { id, client_id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname", "image"],
          },
        ],
      });

      if (!message) {
        return res.status(404).json({
          status: false,
          message: "Mesaj bulunamadı",
        });
      }

      // Mesaj okundu olarak işaretle
      if (message.status !== "read") {
        await message.update({ status: "read" });
      }

      res.json({
        status: true,
        message: "Mesaj detayı başarıyla getirildi",
        data: message,
      });
    } catch (error) {
      logger.error(`Mesaj detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Mesaj detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Mesaj yanıtlama (Psikolog için)
  async respondToMessage(req, res) {
    try {
      const { id } = req.params;
      const { response } = req.body;
      const psyc_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Sadece psikologlar mesaj yanıtlayabilir",
        });
      }

      const message = await Message.findByPk(id);

      if (!message) {
        return res.status(404).json({
          status: false,
          message: "Mesaj bulunamadı",
        });
      }

      // Psikolog kontrolü
      if (message.psyc_id && message.psyc_id !== psyc_id) {
        return res.status(403).json({
          status: false,
          message: "Bu mesajı yanıtlama yetkiniz yok",
        });
      }

      await message.update({
        response,
        psyc_id,
        status: "delivered",
      });

      logger.info(`Mesaj yanıtlandı: ${id}`);
      res.json({
        status: true,
        message: "Mesaj başarıyla yanıtlandı",
        data: message,
      });
    } catch (error) {
      logger.error(`Mesaj yanıtlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Mesaj yanıtlanamadı",
        error: error.message,
      });
    }
  }

  // Mesaj silme
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar mesajlarını silebilir",
        });
      }

      const message = await Message.findOne({
        where: { id, client_id },
      });

      if (!message) {
        return res.status(404).json({
          status: false,
          message: "Mesaj bulunamadı",
        });
      }

      await message.destroy();
      logger.info(`Mesaj silindi: ${id}`);
      res.json({
        status: true,
        message: "Mesaj başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Mesaj silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Mesaj silinemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new MessageController();

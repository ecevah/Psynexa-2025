const { Chat, Client, Psychologist } = require("../models");
const logger = require("../config/logger");

class ChatController {
  // Yeni mesaj gönder
  async sendMessage(req, res) {
    try {
      const sender_id = req.user.id;
      const sender_type = req.user.type;
      const { receiver_id, text, type, reply_chat_id } = req.body;

      const chat = await Chat.create({
        client_id: sender_type === "client" ? sender_id : receiver_id,
        psyc_id: sender_type === "psychologist" ? sender_id : receiver_id,
        sender: sender_type,
        text,
        type,
        reply_chat_id,
        created_by: sender_id,
      });

      logger.info(`Yeni mesaj gönderildi: ${chat.id}`);
      res.status(201).json(chat);
    } catch (error) {
      logger.error(`Mesaj gönderme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj gönderilemedi" });
    }
  }

  // Sohbet geçmişini getir
  async getChatHistory(req, res) {
    try {
      const user_id = req.user.id;
      const user_type = req.user.type;
      const { other_user_id } = req.params;

      const whereClause =
        user_type === "psychologist"
          ? { psyc_id: user_id, client_id: other_user_id }
          : { client_id: user_id, psyc_id: other_user_id };

      const chats = await Chat.findAll({
        where: whereClause,
        include: [
          {
            model: Client,
            attributes: ["id", "name", "avatar_url"],
          },
          {
            model: Psychologist,
            attributes: ["id", "name", "avatar_url"],
          },
          {
            model: Chat,
            as: "ReplyTo",
            attributes: ["id", "text", "sender"],
          },
        ],
        order: [["timestamp", "ASC"]],
      });

      res.json(chats);
    } catch (error) {
      logger.error(`Sohbet geçmişi hatası: ${error.message}`);
      res.status(500).json({ error: "Sohbet geçmişi alınamadı" });
    }
  }

  // Mesajı güncelle
  async updateMessage(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;
      const { text, status } = req.body;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const chat = await Chat.findOne({
        where: whereClause,
      });

      if (!chat) {
        return res.status(404).json({ error: "Mesaj bulunamadı" });
      }

      await chat.update({
        text,
        status,
        updated_by: user_id,
      });

      logger.info(`Mesaj güncellendi: ${id}`);
      res.json(chat);
    } catch (error) {
      logger.error(`Mesaj güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj güncellenemedi" });
    }
  }

  // Mesajı sil
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const chat = await Chat.findOne({
        where: whereClause,
      });

      if (!chat) {
        return res.status(404).json({ error: "Mesaj bulunamadı" });
      }

      await chat.update({
        status: "deleted",
        updated_by: user_id,
      });

      logger.info(`Mesaj silindi: ${id}`);
      res.json({ message: "Mesaj başarıyla silindi" });
    } catch (error) {
      logger.error(`Mesaj silme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj silinemedi" });
    }
  }

  // Okunmamış mesaj sayısını getir
  async getUnreadCount(req, res) {
    try {
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? {
              psyc_id: user_id,
              sender: "client",
              status: "sent",
            }
          : {
              client_id: user_id,
              sender: "psychologist",
              status: "sent",
            };

      const count = await Chat.count({
        where: whereClause,
      });

      res.json({ unread_count: count });
    } catch (error) {
      logger.error(`Okunmamış mesaj sayısı hatası: ${error.message}`);
      res.status(500).json({ error: "Okunmamış mesaj sayısı alınamadı" });
    }
  }

  // Mesajları okundu olarak işaretle
  async markAsRead(req, res) {
    try {
      const user_id = req.user.id;
      const user_type = req.user.type;
      const { other_user_id } = req.params;

      const whereClause =
        user_type === "psychologist"
          ? {
              psyc_id: user_id,
              client_id: other_user_id,
              sender: "client",
              status: "sent",
            }
          : {
              client_id: user_id,
              psyc_id: other_user_id,
              sender: "psychologist",
              status: "sent",
            };

      await Chat.update(
        {
          status: "read",
          updated_by: user_id,
        },
        {
          where: whereClause,
        }
      );

      logger.info(`Mesajlar okundu olarak işaretlendi`);
      res.json({ message: "Mesajlar okundu olarak işaretlendi" });
    } catch (error) {
      logger.error(`Mesaj durumu güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Mesaj durumu güncellenemedi" });
    }
  }
}

module.exports = new ChatController();

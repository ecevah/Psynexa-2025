const { Response, Question, Test } = require("../models");
const logger = require("../config/logger");

class ResponseController {
  // Cevap kaydetme
  async saveResponse(req, res) {
    try {
      const client_id = req.user.id;
      const { test_id, question_id, answer } = req.body;

      // Test ve sorunun varlığını kontrol et
      const test = await Test.findByPk(test_id);
      if (!test) {
        return res.status(404).json({ error: "Test bulunamadı" });
      }

      const question = await Question.findByPk(question_id);
      if (!question) {
        return res.status(404).json({ error: "Soru bulunamadı" });
      }

      // Önceki cevabı kontrol et
      const existingResponse = await Response.findOne({
        where: { client_id, test_id, question_id },
      });

      if (existingResponse) {
        // Cevabı güncelle
        await existingResponse.update({
          answer,
          updated_by: client_id,
        });

        logger.info(`Cevap güncellendi: ${existingResponse.id}`);
        res.json(existingResponse);
      } else {
        // Yeni cevap oluştur
        const response = await Response.create({
          client_id,
          test_id,
          question_id,
          answer,
          created_by: client_id,
          updated_by: client_id,
        });

        logger.info(`Yeni cevap kaydedildi: ${response.id}`);
        res.status(201).json(response);
      }
    } catch (error) {
      logger.error(`Cevap kaydetme hatası: ${error.message}`);
      res.status(500).json({ error: "Cevap kaydedilemedi" });
    }
  }

  // Test cevaplarını getir
  async getTestResponses(req, res) {
    try {
      const { test_id } = req.params;
      const client_id = req.user.id;

      const responses = await Response.findAll({
        where: { test_id, client_id },
        include: [
          {
            model: Question,
            attributes: ["questions", "options", "type"],
          },
        ],
        order: [[Question, "queue", "ASC"]],
      });

      res.json(responses);
    } catch (error) {
      logger.error(`Test cevapları hatası: ${error.message}`);
      res.status(500).json({ error: "Test cevapları alınamadı" });
    }
  }

  // Tüm cevapları getir (Psikolog için)
  async getAllResponses(req, res) {
    try {
      const { test_id } = req.params;

      const responses = await Response.findAll({
        where: { test_id },
        include: [
          {
            model: Question,
            attributes: ["questions", "options", "type"],
          },
        ],
        order: [
          ["client_id", "ASC"],
          [Question, "queue", "ASC"],
        ],
      });

      res.json(responses);
    } catch (error) {
      logger.error(`Tüm cevaplar hatası: ${error.message}`);
      res.status(500).json({ error: "Cevaplar alınamadı" });
    }
  }

  // Cevap silme
  async deleteResponse(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const response = await Response.findOne({
        where: { id, client_id },
      });

      if (!response) {
        return res.status(404).json({ error: "Cevap bulunamadı" });
      }

      await response.destroy();
      logger.info(`Cevap silindi: ${id}`);
      res.json({ message: "Cevap başarıyla silindi" });
    } catch (error) {
      logger.error(`Cevap silme hatası: ${error.message}`);
      res.status(500).json({ error: "Cevap silinemedi" });
    }
  }
}

module.exports = new ResponseController();

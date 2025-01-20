const { Question, Test } = require("../models");
const logger = require("../config/logger");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

class QuestionController {
  // Soru oluşturma
  async createQuestion(req, res) {
    try {
      const psychologist_id = req.user.id;
      const {
        test_id,
        text,
        question_type = "multiple_choice",
        options = [],
        order,
      } = req.body;

      // Test'in varlığını kontrol et
      const test = await Test.findByPk(test_id);
      if (!test) {
        return res
          .status(404)
          .json({ status: false, message: "Test bulunamadı" });
      }

      // Eğer order belirtilmemişse, sıradaki order numarasını bul
      let questionOrder = order;
      if (!questionOrder) {
        const lastQuestion = await Question.findOne({
          where: { test_id },
          order: [["order", "DESC"]],
        });
        questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
      }

      const question = await Question.create({
        test_id,
        question_text: text,
        question_type,
        options,
        order: questionOrder,
        created_by: psychologist_id,
        updated_by: psychologist_id,
      });

      logger.info(`Yeni soru oluşturuldu: ${question.id}`);
      res.status(201).json({ status: true, data: question });
    } catch (error) {
      logger.error(`Soru oluşturma hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Soru oluşturulamadı" });
    }
  }

  // Soru listesi
  async getQuestions(req, res) {
    try {
      const { test_id } = req.params;

      const questions = await Question.findAll({
        where: { test_id },
        order: [["order", "ASC"]],
      });

      res.status(200).json({ status: true, data: questions });
    } catch (error) {
      logger.error(`Soru listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Sorular alınamadı" });
    }
  }

  // Soru detayı
  async getQuestion(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findByPk(id);

      if (!question) {
        return res
          .status(404)
          .json({ status: false, message: "Soru bulunamadı" });
      }

      res.status(200).json({ status: true, data: question });
    } catch (error) {
      logger.error(`Soru detayı hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Soru detayı alınamadı" });
    }
  }

  // Soru güncelleme
  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const psychologist_id = req.user.id;

      const question = await Question.findByPk(id);

      if (!question) {
        return res
          .status(404)
          .json({ status: false, message: "Soru bulunamadı" });
      }

      await question.update({
        ...req.body,
        updated_by: psychologist_id,
      });

      logger.info(`Soru güncellendi: ${id}`);
      res.status(200).json({ status: true, data: question });
    } catch (error) {
      logger.error(`Soru güncelleme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Soru güncellenemedi" });
    }
  }

  // Soru silme
  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findByPk(id);

      if (!question) {
        return res
          .status(404)
          .json({ status: false, message: "Soru bulunamadı" });
      }

      // Silinen sorudan sonraki soruların order'ını güncelle
      await Question.update(
        { order: sequelize.literal("order - 1") },
        {
          where: {
            test_id: question.test_id,
            order: { [Op.gt]: question.order },
          },
        }
      );

      await question.destroy();
      logger.info(`Soru silindi: ${id}`);
      res.status(200).json({ status: true, message: "Soru başarıyla silindi" });
    } catch (error) {
      logger.error(`Soru silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Soru silinemedi" });
    }
  }

  // Soru sırasını güncelleme
  async updateQuestionOrder(req, res) {
    try {
      const { test_id } = req.params;
      const { questions } = req.body; // [{ id: 1, order: 2 }, { id: 2, order: 1 }]

      // Tüm soruların test_id'ye ait olduğunu kontrol et
      const existingQuestions = await Question.findAll({
        where: { test_id },
      });

      if (existingQuestions.length !== questions.length) {
        return res
          .status(400)
          .json({ status: false, message: "Geçersiz soru listesi" });
      }

      // Sıraları güncelle
      await Promise.all(
        questions.map((q) =>
          Question.update({ order: q.order }, { where: { id: q.id } })
        )
      );

      logger.info(`Soru sıralaması güncellendi: Test ${test_id}`);
      res
        .status(200)
        .json({ status: true, message: "Soru sıralaması güncellendi" });
    } catch (error) {
      logger.error(`Soru sıralama hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Soru sıralaması güncellenemedi" });
    }
  }
}

module.exports = new QuestionController();

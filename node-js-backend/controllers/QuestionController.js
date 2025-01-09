const { Question, Test } = require("../models");
const logger = require("../config/logger");

class QuestionController {
  // Soru oluşturma
  async createQuestion(req, res) {
    try {
      const psychologist_id = req.user.id;
      const { test_id } = req.body;

      // Test'in varlığını kontrol et
      const test = await Test.findByPk(test_id);
      if (!test) {
        return res.status(404).json({ error: "Test bulunamadı" });
      }

      // Sıradaki queue numarasını bul
      const lastQuestion = await Question.findOne({
        where: { test_id },
        order: [["queue", "DESC"]],
      });
      const nextQueue = lastQuestion ? lastQuestion.queue + 1 : 1;

      const question = await Question.create({
        ...req.body,
        queue: nextQueue,
        created_by: psychologist_id,
        updated_by: psychologist_id,
      });

      logger.info(`Yeni soru oluşturuldu: ${question.id}`);
      res.status(201).json(question);
    } catch (error) {
      logger.error(`Soru oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Soru oluşturulamadı" });
    }
  }

  // Soru listesi
  async getQuestions(req, res) {
    try {
      const { test_id } = req.params;

      const questions = await Question.findAll({
        where: { test_id },
        order: [["queue", "ASC"]],
      });

      res.json(questions);
    } catch (error) {
      logger.error(`Soru listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Sorular alınamadı" });
    }
  }

  // Soru detayı
  async getQuestion(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findByPk(id);

      if (!question) {
        return res.status(404).json({ error: "Soru bulunamadı" });
      }

      res.json(question);
    } catch (error) {
      logger.error(`Soru detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Soru detayı alınamadı" });
    }
  }

  // Soru güncelleme
  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const psychologist_id = req.user.id;

      const question = await Question.findByPk(id);

      if (!question) {
        return res.status(404).json({ error: "Soru bulunamadı" });
      }

      await question.update({
        ...req.body,
        updated_by: psychologist_id,
      });

      logger.info(`Soru güncellendi: ${id}`);
      res.json(question);
    } catch (error) {
      logger.error(`Soru güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Soru güncellenemedi" });
    }
  }

  // Soru silme
  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findByPk(id);

      if (!question) {
        return res.status(404).json({ error: "Soru bulunamadı" });
      }

      // Silinen sorudan sonraki soruların queue'sunu güncelle
      await Question.update(
        { queue: sequelize.literal("queue - 1") },
        {
          where: {
            test_id: question.test_id,
            queue: { [Op.gt]: question.queue },
          },
        }
      );

      await question.destroy();
      logger.info(`Soru silindi: ${id}`);
      res.json({ message: "Soru başarıyla silindi" });
    } catch (error) {
      logger.error(`Soru silme hatası: ${error.message}`);
      res.status(500).json({ error: "Soru silinemedi" });
    }
  }

  // Soru sırasını güncelleme
  async updateQuestionOrder(req, res) {
    try {
      const { test_id } = req.params;
      const { questions } = req.body; // [{ id: 1, queue: 2 }, { id: 2, queue: 1 }]

      // Tüm soruların test_id'ye ait olduğunu kontrol et
      const existingQuestions = await Question.findAll({
        where: { test_id },
      });

      if (existingQuestions.length !== questions.length) {
        return res.status(400).json({ error: "Geçersiz soru listesi" });
      }

      // Sıraları güncelle
      await Promise.all(
        questions.map((q) =>
          Question.update({ queue: q.queue }, { where: { id: q.id } })
        )
      );

      logger.info(`Soru sıralaması güncellendi: Test ${test_id}`);
      res.json({ message: "Soru sıralaması güncellendi" });
    } catch (error) {
      logger.error(`Soru sıralama hatası: ${error.message}`);
      res.status(500).json({ error: "Soru sıralaması güncellenemedi" });
    }
  }
}

module.exports = new QuestionController();

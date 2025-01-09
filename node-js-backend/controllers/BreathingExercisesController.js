const {
  BreathingExercises,
  BreathingExercisesIteration,
  Psychologist,
} = require("../models");
const logger = require("../config/logger");

class BreathingExercisesController {
  // Yeni nefes egzersizi oluştur
  async createBreathingExercise(req, res) {
    try {
      const psyc_id = req.user.id;
      const {
        title,
        content_type,
        background_sound,
        description,
        status,
        iterations,
      } = req.body;

      const exercise = await BreathingExercises.create({
        psyc_id,
        title,
        content_type,
        background_sound,
        description,
        status,
        created_by: psyc_id,
      });

      if (iterations && iterations.length > 0) {
        const iterationsToCreate = iterations.map((iteration) => ({
          ...iteration,
          breathing_exercises_id: exercise.id,
          created_by: psyc_id,
        }));

        await BreathingExercisesIteration.bulkCreate(iterationsToCreate);
      }

      logger.info(`Yeni nefes egzersizi oluşturuldu: ${exercise.id}`);
      res.status(201).json(exercise);
    } catch (error) {
      logger.error(`Nefes egzersizi oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizi oluşturulamadı" });
    }
  }

  // Tüm nefes egzersizlerini getir
  async getBreathingExercises(req, res) {
    try {
      const exercises = await BreathingExercises.findAll({
        where: { status: "active" },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: BreathingExercisesIteration,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound",
              "order",
              "timer",
              "status",
            ],
          },
        ],
        order: [
          ["created_at", "DESC"],
          [BreathingExercisesIteration, "order", "ASC"],
        ],
      });

      res.json(exercises);
    } catch (error) {
      logger.error(`Nefes egzersizi listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizleri alınamadı" });
    }
  }

  // Psikoloğun nefes egzersizlerini getir
  async getPsychologistBreathingExercises(req, res) {
    try {
      const psyc_id = req.user.id;
      const exercises = await BreathingExercises.findAll({
        where: { psyc_id },
        include: [
          {
            model: BreathingExercisesIteration,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound",
              "order",
              "timer",
              "status",
            ],
          },
        ],
        order: [
          ["created_at", "DESC"],
          [BreathingExercisesIteration, "order", "ASC"],
        ],
      });

      res.json(exercises);
    } catch (error) {
      logger.error(`Nefes egzersizi listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizleri alınamadı" });
    }
  }

  // Nefes egzersizi detayı
  async getBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const exercise = await BreathingExercises.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: BreathingExercisesIteration,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound",
              "order",
              "timer",
              "status",
            ],
          },
        ],
      });

      if (!exercise) {
        return res.status(404).json({ error: "Nefes egzersizi bulunamadı" });
      }

      res.json(exercise);
    } catch (error) {
      logger.error(`Nefes egzersizi detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizi detayı alınamadı" });
    }
  }

  // Nefes egzersizi güncelle
  async updateBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const {
        title,
        content_type,
        background_sound,
        description,
        status,
        iterations,
      } = req.body;

      const exercise = await BreathingExercises.findOne({
        where: { id, psyc_id },
      });

      if (!exercise) {
        return res.status(404).json({ error: "Nefes egzersizi bulunamadı" });
      }

      await exercise.update({
        title,
        content_type,
        background_sound,
        description,
        status,
        updated_by: psyc_id,
      });

      if (iterations && iterations.length > 0) {
        // Mevcut iterasyonları sil
        await BreathingExercisesIteration.destroy({
          where: { breathing_exercises_id: id },
        });

        // Yeni iterasyonları ekle
        const iterationsToCreate = iterations.map((iteration) => ({
          ...iteration,
          breathing_exercises_id: id,
          created_by: psyc_id,
        }));

        await BreathingExercisesIteration.bulkCreate(iterationsToCreate);
      }

      logger.info(`Nefes egzersizi güncellendi: ${id}`);
      res.json(exercise);
    } catch (error) {
      logger.error(`Nefes egzersizi güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizi güncellenemedi" });
    }
  }

  // Nefes egzersizi sil
  async deleteBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const exercise = await BreathingExercises.findOne({
        where: { id, psyc_id },
      });

      if (!exercise) {
        return res.status(404).json({ error: "Nefes egzersizi bulunamadı" });
      }

      // İlişkili iterasyonları sil
      await BreathingExercisesIteration.destroy({
        where: { breathing_exercises_id: id },
      });

      // Nefes egzersizini sil
      await exercise.destroy();

      logger.info(`Nefes egzersizi silindi: ${id}`);
      res.json({ message: "Nefes egzersizi başarıyla silindi" });
    } catch (error) {
      logger.error(`Nefes egzersizi silme hatası: ${error.message}`);
      res.status(500).json({ error: "Nefes egzersizi silinemedi" });
    }
  }
}

module.exports = new BreathingExercisesController();

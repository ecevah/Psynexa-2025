const {
  BreathingExercise,
  BreathingExerciseItem,
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
        description,
        duration,
        items,
        content_type = "text",
        background_sound,
      } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          status: false,
          message: "En az bir egzersiz öğesi gereklidir",
        });
      }

      const exercise = await BreathingExercise.create({
        psyc_id,
        title,
        description,
        duration,
        content_type,
        background_sound,
        status: "active",
        created_by: psyc_id,
      });

      const itemsToCreate = items.map((item) => ({
        ...item,
        breathing_exercise_id: exercise.id,
        status: true,
      }));

      await BreathingExerciseItem.bulkCreate(itemsToCreate);

      const result = await BreathingExercise.findByPk(exercise.id, {
        include: [
          {
            model: BreathingExerciseItem,
            as: "items",
            order: [["order", "ASC"]],
          },
        ],
      });

      logger.info(`Yeni nefes egzersizi oluşturuldu: ${exercise.id}`);
      res.status(201).json({
        status: true,
        message: "Nefes egzersizi başarıyla oluşturuldu",
        data: result,
      });
    } catch (error) {
      logger.error(`Nefes egzersizi oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizi oluşturulamadı",
      });
    }
  }

  // Tüm nefes egzersizlerini getir
  async getBreathingExercises(req, res) {
    try {
      const exercises = await BreathingExercise.findAll({
        where: { status: "active" },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
          {
            model: BreathingExerciseItem,
            as: "items",
            where: { status: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Nefes egzersizleri başarıyla getirildi",
        data: exercises,
      });
    } catch (error) {
      logger.error(`Nefes egzersizi listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizleri alınamadı",
      });
    }
  }

  // Psikoloğun nefes egzersizlerini getir
  async getPsychologistBreathingExercises(req, res) {
    try {
      const psyc_id = req.user.id;
      const exercises = await BreathingExercise.findAll({
        where: { psyc_id },
        include: [
          {
            model: BreathingExerciseItem,
            as: "items",
            where: { status: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Psikolog nefes egzersizleri başarıyla getirildi",
        data: exercises,
      });
    } catch (error) {
      logger.error(`Nefes egzersizi listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizleri alınamadı",
      });
    }
  }

  // Nefes egzersizi detayı
  async getBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const exercise = await BreathingExercise.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
          {
            model: BreathingExerciseItem,
            as: "items",
            where: { status: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!exercise) {
        return res.status(404).json({
          status: false,
          message: "Nefes egzersizi bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Nefes egzersizi başarıyla getirildi",
        data: exercise,
      });
    } catch (error) {
      logger.error(`Nefes egzersizi detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizi detayı alınamadı",
      });
    }
  }

  // Nefes egzersizi güncelle
  async updateBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const { title, description, duration, items } = req.body;

      const exercise = await BreathingExercise.findOne({
        where: { id, psyc_id },
      });

      if (!exercise) {
        return res.status(404).json({
          status: false,
          message: "Nefes egzersizi bulunamadı",
        });
      }

      await exercise.update({
        title,
        description,
        duration,
      });

      if (items && items.length > 0) {
        // Mevcut öğeleri pasife çek
        await BreathingExerciseItem.update(
          { status: false },
          { where: { breathing_exercise_id: id } }
        );

        // Yeni öğeleri ekle
        const itemsToCreate = items.map((item) => ({
          ...item,
          breathing_exercise_id: id,
          status: true,
        }));

        await BreathingExerciseItem.bulkCreate(itemsToCreate);
      }

      const result = await BreathingExercise.findByPk(id, {
        include: [
          {
            model: BreathingExerciseItem,
            as: "items",
            where: { status: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });

      logger.info(`Nefes egzersizi güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Nefes egzersizi başarıyla güncellendi",
        data: result,
      });
    } catch (error) {
      logger.error(`Nefes egzersizi güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizi güncellenemedi",
      });
    }
  }

  // Nefes egzersizi sil
  async deleteBreathingExercise(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const exercise = await BreathingExercise.findOne({
        where: { id, psyc_id },
      });

      if (!exercise) {
        return res.status(404).json({
          status: false,
          message: "Nefes egzersizi bulunamadı",
        });
      }

      // Egzersizi pasife çek
      await exercise.update({ status: "inactive" });

      // Öğeleri pasife çek
      await BreathingExerciseItem.update(
        { status: false },
        { where: { breathing_exercise_id: id } }
      );

      logger.info(`Nefes egzersizi silindi: ${id}`);
      res.json({
        status: true,
        message: "Nefes egzersizi başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Nefes egzersizi silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Nefes egzersizi silinemedi",
      });
    }
  }
}

module.exports = new BreathingExercisesController();

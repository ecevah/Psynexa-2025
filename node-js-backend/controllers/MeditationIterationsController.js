const {
  MeditationIterations,
  MeditationIterationsItem,
  Psychologist,
} = require("../models");
const logger = require("../config/logger");

class MeditationIterationsController {
  // Yeni meditasyon iterasyonu oluştur
  async createMeditationIteration(req, res) {
    try {
      const psyc_id = req.user.id;
      const { title, content_type, background_sound, description, items } =
        req.body;

      const meditation = await MeditationIterations.create({
        psyc_id,
        title,
        content_type,
        background_sound,
        description,
        created_by: psyc_id,
      });

      if (items && items.length > 0) {
        const itemsToCreate = items.map((item) => ({
          ...item,
          meditation_id: meditation.id,
          created_by: psyc_id,
        }));

        await MeditationIterationsItem.bulkCreate(itemsToCreate);
      }

      logger.info(`Yeni meditasyon iterasyonu oluşturuldu: ${meditation.id}`);
      res.status(201).json(meditation);
    } catch (error) {
      logger.error(`Meditasyon iterasyonu oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonu oluşturulamadı" });
    }
  }

  // Tüm meditasyon iterasyonlarını getir
  async getMeditationIterations(req, res) {
    try {
      const meditations = await MeditationIterations.findAll({
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: MeditationIterationsItem,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound_url",
              "order",
              "timer",
              "status",
            ],
          },
        ],
        order: [
          ["created_at", "DESC"],
          [MeditationIterationsItem, "order", "ASC"],
        ],
      });

      res.json(meditations);
    } catch (error) {
      logger.error(`Meditasyon iterasyonu listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonları alınamadı" });
    }
  }

  // Psikoloğun meditasyon iterasyonlarını getir
  async getPsychologistMeditationIterations(req, res) {
    try {
      const psyc_id = req.user.id;
      const meditations = await MeditationIterations.findAll({
        where: { psyc_id },
        include: [
          {
            model: MeditationIterationsItem,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound_url",
              "order",
              "timer",
              "status",
            ],
          },
        ],
        order: [
          ["created_at", "DESC"],
          [MeditationIterationsItem, "order", "ASC"],
        ],
      });

      res.json(meditations);
    } catch (error) {
      logger.error(`Meditasyon iterasyonu listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonları alınamadı" });
    }
  }

  // Meditasyon iterasyonu detayı
  async getMeditationIteration(req, res) {
    try {
      const { id } = req.params;
      const meditation = await MeditationIterations.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: MeditationIterationsItem,
            attributes: [
              "id",
              "title",
              "description",
              "media_url",
              "description_sound_url",
              "order",
              "timer",
              "status",
            ],
          },
        ],
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ error: "Meditasyon iterasyonu bulunamadı" });
      }

      res.json(meditation);
    } catch (error) {
      logger.error(`Meditasyon iterasyonu detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonu detayı alınamadı" });
    }
  }

  // Meditasyon iterasyonu güncelle
  async updateMeditationIteration(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const { title, content_type, background_sound, description, items } =
        req.body;

      const meditation = await MeditationIterations.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ error: "Meditasyon iterasyonu bulunamadı" });
      }

      await meditation.update({
        title,
        content_type,
        background_sound,
        description,
        updated_by: psyc_id,
      });

      if (items && items.length > 0) {
        // Mevcut öğeleri sil
        await MeditationIterationsItem.destroy({
          where: { meditation_id: id },
        });

        // Yeni öğeleri ekle
        const itemsToCreate = items.map((item) => ({
          ...item,
          meditation_id: id,
          created_by: psyc_id,
        }));

        await MeditationIterationsItem.bulkCreate(itemsToCreate);
      }

      logger.info(`Meditasyon iterasyonu güncellendi: ${id}`);
      res.json(meditation);
    } catch (error) {
      logger.error(`Meditasyon iterasyonu güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonu güncellenemedi" });
    }
  }

  // Meditasyon iterasyonu sil
  async deleteMeditationIteration(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const meditation = await MeditationIterations.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ error: "Meditasyon iterasyonu bulunamadı" });
      }

      // İlişkili öğeleri sil
      await MeditationIterationsItem.destroy({
        where: { meditation_id: id },
      });

      // Meditasyon iterasyonunu sil
      await meditation.destroy();

      logger.info(`Meditasyon iterasyonu silindi: ${id}`);
      res.json({ message: "Meditasyon iterasyonu başarıyla silindi" });
    } catch (error) {
      logger.error(`Meditasyon iterasyonu silme hatası: ${error.message}`);
      res.status(500).json({ error: "Meditasyon iterasyonu silinemedi" });
    }
  }
}

module.exports = new MeditationIterationsController();

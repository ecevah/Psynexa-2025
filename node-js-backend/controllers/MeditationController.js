const { Meditation, Psychologist } = require("../models");
const logger = require("../config/logger");

class MeditationController {
  // Yeni meditasyon oluştur
  async createMeditation(req, res) {
    try {
      const psyc_id = req.user.id;
      const {
        title,
        description,
        content,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
      } = req.body;

      const meditation = await Meditation.create({
        psyc_id,
        title,
        description,
        content,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
        created_by: psyc_id,
      });

      logger.info(`Yeni meditasyon oluşturuldu: ${meditation.id}`);
      res.status(201).json({
        status: true,
        message: "Meditasyon oluşturuldu",
        data: meditation,
      });
    } catch (error) {
      logger.error(`Meditasyon oluşturma hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon oluşturulamadı" });
    }
  }

  // Tüm meditasyonları getir
  async getMeditations(req, res) {
    try {
      const meditations = await Meditation.findAll({
        where: { status: "published" },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
        ],
        order: [["published_at", "DESC"]],
      });

      res.json(meditations);
    } catch (error) {
      logger.error(`Meditasyon listesi hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyonlar alınamadı" });
    }
  }

  // Psikoloğun meditasyonlarını getir
  async getPsychologistMeditations(req, res) {
    try {
      const psyc_id = req.user.id;
      const meditations = await Meditation.findAll({
        where: { psyc_id },
        order: [["created_at", "DESC"]],
      });

      res.json(meditations);
    } catch (error) {
      logger.error(`Meditasyon listesi hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyonlar alınamadı" });
    }
  }

  // Meditasyon detayı
  async getMeditation(req, res) {
    try {
      const { id } = req.params;
      const meditation = await Meditation.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      res.json(meditation);
    } catch (error) {
      logger.error(`Meditasyon detayı hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon detayı alınamadı" });
    }
  }

  // Meditasyon güncelle
  async updateMeditation(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const {
        title,
        description,
        content,
        status,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
      } = req.body;

      const meditation = await Meditation.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      if (status === "published" && meditation.status !== "published") {
        req.body.published_at = new Date();
      }

      if (status === "draft" && meditation.status !== "draft") {
        req.body.draft_update_date = new Date();
      }

      await meditation.update({
        ...req.body,
        updated_by: psyc_id,
      });

      logger.info(`Meditasyon güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Meditasyon başarıyla güncellendi",
        data: meditation,
      });
    } catch (error) {
      logger.error(`Meditasyon güncelleme hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon güncellenemedi" });
    }
  }

  // Meditasyon sil
  async deleteMeditation(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const meditation = await Meditation.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      await meditation.update({
        status: "archived",
        updated_by: psyc_id,
      });

      logger.info(`Meditasyon arşivlendi: ${id}`);
      res.json({ status: true, message: "Meditasyon başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Meditasyon silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Meditasyon silinemedi" });
    }
  }
}

module.exports = new MeditationController();

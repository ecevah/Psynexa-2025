const { Psychologist } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PsychologistController {
  // Tüm psikologları getir (filtreleme, arama, sıralama ve sayfalama ile)
  async getAllPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Psikolog listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Psikologlar getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir psikoloğu getir
  async getPsychologist(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.params.id);

      if (!psychologist) {
        return res.status(404).json({
          success: false,
          error: "Psikolog bulunamadı",
        });
      }

      res.json({
        success: true,
        data: psychologist,
      });
    } catch (error) {
      logger.error(`Psikolog getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Psikolog getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni psikolog oluştur
  async createPsychologist(req, res) {
    try {
      const psychologist = await Psychologist.create(req.body);

      logger.info(`Yeni psikolog oluşturuldu: ${psychologist.email}`);
      res.status(201).json({
        success: true,
        data: psychologist,
      });
    } catch (error) {
      logger.error(`Psikolog oluşturma hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Psikolog oluşturulurken bir hata oluştu",
      });
    }
  }

  // Psikoloğu güncelle
  async updatePsychologist(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.params.id);

      if (!psychologist) {
        return res.status(404).json({
          success: false,
          error: "Psikolog bulunamadı",
        });
      }

      await psychologist.update(req.body);

      logger.info(`Psikolog güncellendi: ${psychologist.email}`);
      res.json({
        success: true,
        data: psychologist,
      });
    } catch (error) {
      logger.error(`Psikolog güncelleme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Psikolog güncellenirken bir hata oluştu",
      });
    }
  }

  // Psikoloğu sil
  async deletePsychologist(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.params.id);

      if (!psychologist) {
        return res.status(404).json({
          success: false,
          error: "Psikolog bulunamadı",
        });
      }

      await psychologist.destroy();

      logger.info(`Psikolog silindi: ${psychologist.email}`);
      res.json({
        success: true,
        message: "Psikolog başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Psikolog silme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Psikolog silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new PsychologistController();

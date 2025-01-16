const { Psychologist, WorkingArea } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PsychologistController {
  // Tüm psikologları getir
  async getAllPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute({
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
            attributes: [
              "id",
              "name",
              "description",
              "experience_years",
              "certificates",
              "status",
            ],
          },
        ],
        attributes: {
          exclude: ["password", "reset_token", "reset_token_expiry"], // Hassas bilgileri hariç tut
        },
        order: [
          ["created_at", "DESC"],
          [{ model: WorkingArea, as: "WorkingAreas" }, "created_at", "DESC"],
        ],
      });

      res.status(200).json({
        status: true,
        message: "Psikologlar başarıyla getirildi",
        data: result,
      });
    } catch (error) {
      logger.error(`Psikolog listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikologlar getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir psikoloğu getir
  async getPsychologist(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.params.id, {
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
            attributes: [
              "id",
              "name",
              "description",
              "experience_years",
              "certificates",
              "status",
            ],
          },
        ],
      });

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
      const { working_areas, ...psychologistData } = req.body;

      const psychologist = await Psychologist.create(psychologistData);

      if (working_areas && Array.isArray(working_areas)) {
        const workingAreaPromises = working_areas.map((area) => {
          return WorkingArea.create({
            ...area,
            psychologist_id: psychologist.id,
          });
        });
        await Promise.all(workingAreaPromises);
      }

      // Oluşturulan psikoloğu working area'ları ile birlikte getir
      const createdPsychologist = await Psychologist.findByPk(psychologist.id, {
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
            attributes: [
              "id",
              "name",
              "description",
              "experience_years",
              "certificates",
              "status",
            ],
          },
        ],
      });

      logger.info(`Yeni psikolog oluşturuldu: ${psychologist.email}`);
      res.status(201).json({
        success: true,
        data: createdPsychologist,
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

      // Güncellenmiş psikoloğu working area'ları ile birlikte getir
      const updatedPsychologist = await Psychologist.findByPk(req.params.id, {
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
            attributes: [
              "id",
              "name",
              "description",
              "experience_years",
              "certificates",
              "status",
            ],
          },
        ],
      });

      logger.info(`Psikolog güncellendi: ${psychologist.email}`);
      res.json({
        success: true,
        data: updatedPsychologist,
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

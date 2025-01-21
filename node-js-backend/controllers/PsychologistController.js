const { Psychologist, WorkingArea, Client } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PsychologistController {
  // Tüm psikologları getir
  async getAllPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter()
        .search(["name", "surname", "email", "phone"])
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute({
        include: [
          {
            model: WorkingArea,
            as: "workingAreas",
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
          exclude: ["password", "reset_token", "reset_token_expiry"],
        },
        where: {
          approve_status: "approved", // Sadece onaylı psikologları göster
          status: "active",
        },
      });

      res.status(200).json({
        status: true,
        message: "Psikologlar başarıyla getirildi",
        data: result,
      });
    } catch (error) {
      logger.error(`Psikolog listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikologlar getirilemedi",
        error: error.message,
      });
    }
  }

  // Tek bir psikoloğu getir
  async getPsychologist(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Yetki kontrolü
      if (user?.type === "psychologist" && user.id !== parseInt(id)) {
        return res.status(403).json({
          status: false,
          message: "Başka bir psikoloğun bilgilerini görüntüleyemezsiniz",
        });
      }

      const psychologist = await Psychologist.findOne({
        where: {
          id,
          ...(user?.type === "client"
            ? { approve_status: "approved", status: "active" }
            : {}),
        },
        include: [
          {
            model: WorkingArea,
            as: "workingAreas",
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
          exclude: ["password", "reset_token", "reset_token_expiry"],
        },
      });

      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Psikolog başarıyla getirildi",
        data: psychologist,
      });
    } catch (error) {
      logger.error(`Psikolog getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikolog getirilemedi",
        error: error.message,
      });
    }
  }

  // Yeni psikolog oluştur
  async createPsychologist(req, res) {
    try {
      // Yetki kontrolü
      if (req.user.type !== "staff") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const { working_areas, ...psychologistData } = req.body;

      const psychologist = await Psychologist.create(psychologistData);

      if (working_areas && Array.isArray(working_areas)) {
        const workingAreaPromises = working_areas.map((area) => {
          return WorkingArea.create({
            ...area,
            psyc_id: psychologist.id,
          });
        });
        await Promise.all(workingAreaPromises);
      }

      const createdPsychologist = await Psychologist.findByPk(psychologist.id, {
        include: [
          {
            model: WorkingArea,
            as: "workingAreas",
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
          exclude: ["password", "reset_token", "reset_token_expiry"],
        },
      });

      logger.info(`Yeni psikolog oluşturuldu: ${psychologist.email}`);
      res.status(201).json({
        status: true,
        message: "Psikolog başarıyla oluşturuldu",
        data: createdPsychologist,
      });
    } catch (error) {
      logger.error(`Psikolog oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikolog oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Psikoloğu güncelle
  async updatePsychologist(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Yetki kontrolü
      if (user.type === "psychologist" && user.id !== parseInt(id)) {
        return res.status(403).json({
          status: false,
          message: "Başka bir psikoloğun bilgilerini güncelleyemezsiniz",
        });
      }

      const psychologist = await Psychologist.findByPk(id);

      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
        });
      }

      // Staff ve psikolog için izin verilen alanlar
      const allowedFields = {
        staff: [
          "name",
          "surname",
          "email",
          "phone",
          "date_of_birth",
          "sex",
          "image",
          "pdf",
          "experience",
          "status",
          "approve_status",
        ],
        psychologist: [
          "name",
          "surname",
          "email",
          "phone",
          "date_of_birth",
          "sex",
          "image",
          "pdf",
          "experience",
        ],
      };

      const updateData = {};
      Object.keys(req.body).forEach((field) => {
        if (allowedFields[user.type]?.includes(field)) {
          updateData[field] = req.body[field];
        }
      });

      await psychologist.update(updateData);

      const updatedPsychologist = await Psychologist.findByPk(id, {
        include: [
          {
            model: WorkingArea,
            as: "workingAreas",
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
          exclude: ["password", "reset_token", "reset_token_expiry"],
        },
      });

      logger.info(`Psikolog güncellendi: ${psychologist.email}`);
      res.json({
        status: true,
        message: "Psikolog başarıyla güncellendi",
        data: updatedPsychologist,
      });
    } catch (error) {
      logger.error(`Psikolog güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikolog güncellenemedi",
        error: error.message,
      });
    }
  }

  // Psikoloğu sil (soft delete)
  async deletePsychologist(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Yetki kontrolü - sadece staff silebilir
      if (user.type !== "staff") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const psychologist = await Psychologist.findByPk(id);

      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
        });
      }

      // Aktif danışanı var mı kontrol et
      const activeClients = await Client.count({
        where: {
          psyc_id: id,
          status: "active",
        },
      });

      if (activeClients > 0) {
        return res.status(400).json({
          status: false,
          message: "Aktif danışanı olan psikolog silinemez",
        });
      }

      // Soft delete - status'u inactive yap
      await psychologist.update({ status: "inactive" });

      logger.info(`Psikolog silindi: ${psychologist.email}`);
      res.json({
        status: true,
        message: "Psikolog başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Psikolog silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Psikolog silinemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new PsychologistController();

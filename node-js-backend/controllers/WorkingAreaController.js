const { WorkingArea } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

const workingAreaInclude = {
  model: WorkingArea,
  attributes: [
    "id",
    "name",
    "description",
    "experience_years",
    "certificates",
    "status",
  ],
};

class WorkingAreaController {
  // Tüm çalışma alanlarını getir
  async getAllWorkingAreas(req, res) {
    try {
      const features = new APIFeatures(WorkingArea, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.status(200).json({
        status: true,
        message: "Çalışma alanları başarıyla getirildi",
        data: result,
      });
    } catch (error) {
      logger.error(`Çalışma alanı listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çalışma alanları getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir çalışma alanı getir
  async getWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findByPk(req.params.id);

      if (!workingArea) {
        return res.status(404).json({
          status: false,
          message: "Çalışma alanı bulunamadı",
        });
      }

      res.status(200).json({
        status: true,
        message: "Çalışma alanı başarıyla getirildi",
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çalışma alanı getirilirken bir hata oluştu",
      });
    }
  }

  // Psikoloğun çalışma alanlarını getir
  async getPsychologistWorkingAreas(req, res) {
    try {
      const features = new APIFeatures(WorkingArea, {
        ...req.query,
        psychologist_id: req.user.id,
      })
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.status(200).json({
        status: true,
        message: "Psikolog çalışma alanları başarıyla getirildi",
        data: result,
      });
    } catch (error) {
      logger.error(
        `Psikolog çalışma alanları getirme hatası: ${error.message}`
      );
      res.status(500).json({
        status: false,
        message: "Psikolog çalışma alanları getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni çalışma alanı oluştur
  async createWorkingArea(req, res) {
    try {
      logger.info("createWorkingArea başladı");
      logger.info(`User bilgisi: ${JSON.stringify(req.user)}`);
      logger.info(`Request body: ${JSON.stringify(req.body)}`);

      const workingArea = await WorkingArea.create({
        ...req.body,
        psychologist_id: req.user.id,
      });

      logger.info(`Oluşturulan working area: ${JSON.stringify(workingArea)}`);
      logger.info(`Yeni çalışma alanı oluşturuldu: ${workingArea.name}`);
      res.status(201).json({
        status: true,
        message: "Yeni çalışma alanı başarıyla oluşturuldu",
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çalışma alanı oluşturulurken bir hata oluştu",
      });
    }
  }

  // Çalışma alanı güncelle
  async updateWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findOne({
        where: {
          id: req.params.id,
          psychologist_id: req.user.id,
        },
      });

      if (!workingArea) {
        return res.status(404).json({
          status: false,
          message: "Çalışma alanı bulunamadı",
        });
      }

      await workingArea.update(req.body);

      logger.info(`Çalışma alanı güncellendi: ${workingArea.name}`);
      res.status(200).json({
        status: true,
        message: "Çalışma alanı başarıyla güncellendi",
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çalışma alanı güncellenirken bir hata oluştu",
      });
    }
  }

  // Çalışma alanı sil
  async deleteWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findOne({
        where: {
          id: req.params.id,
          psychologist_id: req.user.id,
        },
      });

      if (!workingArea) {
        return res.status(404).json({
          status: false,
          message: "Çalışma alanı bulunamadı",
        });
      }

      await workingArea.destroy();

      logger.info(`Çalışma alanı silindi: ${workingArea.name}`);
      res.status(200).json({
        status: true,
        message: "Çalışma alanı başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Çalışma alanı silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çalışma alanı silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new WorkingAreaController();

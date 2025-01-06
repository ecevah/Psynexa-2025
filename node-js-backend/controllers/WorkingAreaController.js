const { WorkingArea } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

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

      res.json(result);
    } catch (error) {
      logger.error(`Çalışma alanı listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Çalışma alanları getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir çalışma alanı getir
  async getWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findByPk(req.params.id);

      if (!workingArea) {
        return res.status(404).json({
          success: false,
          error: "Çalışma alanı bulunamadı",
        });
      }

      res.json({
        success: true,
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Çalışma alanı getirilirken bir hata oluştu",
      });
    }
  }

  // Psikoloğun çalışma alanlarını getir
  async getPsychologistWorkingAreas(req, res) {
    try {
      const features = new APIFeatures(WorkingArea, {
        ...req.query,
        psychologist_id: req.params.psychologistId,
      })
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(
        `Psikolog çalışma alanları getirme hatası: ${error.message}`
      );
      res.status(500).json({
        success: false,
        error: "Psikolog çalışma alanları getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni çalışma alanı oluştur
  async createWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.create(req.body);

      logger.info(`Yeni çalışma alanı oluşturuldu: ${workingArea.name}`);
      res.status(201).json({
        success: true,
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı oluşturma hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Çalışma alanı oluşturulurken bir hata oluştu",
      });
    }
  }

  // Çalışma alanı güncelle
  async updateWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findByPk(req.params.id);

      if (!workingArea) {
        return res.status(404).json({
          success: false,
          error: "Çalışma alanı bulunamadı",
        });
      }

      await workingArea.update(req.body);

      logger.info(`Çalışma alanı güncellendi: ${workingArea.name}`);
      res.json({
        success: true,
        data: workingArea,
      });
    } catch (error) {
      logger.error(`Çalışma alanı güncelleme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Çalışma alanı güncellenirken bir hata oluştu",
      });
    }
  }

  // Çalışma alanı sil
  async deleteWorkingArea(req, res) {
    try {
      const workingArea = await WorkingArea.findByPk(req.params.id);

      if (!workingArea) {
        return res.status(404).json({
          success: false,
          error: "Çalışma alanı bulunamadı",
        });
      }

      await workingArea.destroy();

      logger.info(`Çalışma alanı silindi: ${workingArea.name}`);
      res.json({
        success: true,
        message: "Çalışma alanı başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Çalışma alanı silme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Çalışma alanı silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new WorkingAreaController();

const { Package } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PackageController {
  // Tüm paketleri getir
  async getAllPackages(req, res) {
    try {
      const features = new APIFeatures(Package, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Paket listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Paketler getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir paket getir
  async getPackage(req, res) {
    try {
      const packageData = await Package.findByPk(req.params.id);

      if (!packageData) {
        return res.status(404).json({
          success: false,
          error: "Paket bulunamadı",
        });
      }

      res.json({
        success: true,
        data: packageData,
      });
    } catch (error) {
      logger.error(`Paket getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Paket getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni paket oluştur
  async createPackage(req, res) {
    try {
      const packageData = await Package.create(req.body);

      logger.info(`Yeni paket oluşturuldu: ${packageData.name}`);
      res.status(201).json({
        success: true,
        data: packageData,
      });
    } catch (error) {
      logger.error(`Paket oluşturma hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Paket oluşturulurken bir hata oluştu",
      });
    }
  }

  // Paket güncelle
  async updatePackage(req, res) {
    try {
      const packageData = await Package.findByPk(req.params.id);

      if (!packageData) {
        return res.status(404).json({
          success: false,
          error: "Paket bulunamadı",
        });
      }

      await packageData.update(req.body);

      logger.info(`Paket güncellendi: ${packageData.name}`);
      res.json({
        success: true,
        data: packageData,
      });
    } catch (error) {
      logger.error(`Paket güncelleme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Paket güncellenirken bir hata oluştu",
      });
    }
  }

  // Paket sil
  async deletePackage(req, res) {
    try {
      const packageData = await Package.findByPk(req.params.id);

      if (!packageData) {
        return res.status(404).json({
          success: false,
          error: "Paket bulunamadı",
        });
      }

      await packageData.destroy();

      logger.info(`Paket silindi: ${packageData.name}`);
      res.json({
        success: true,
        message: "Paket başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Paket silme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Paket silinirken bir hata oluştu",
      });
    }
  }

  // Aktif paketleri getir
  async getActivePackages(req, res) {
    try {
      const features = new APIFeatures(Package, {
        ...req.query,
        status: true,
      })
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Aktif paket listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Aktif paketler getirilirken bir hata oluştu",
      });
    }
  }
}

module.exports = new PackageController();

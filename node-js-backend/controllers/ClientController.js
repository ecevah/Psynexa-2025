const { Client } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class ClientController {
  // Tüm clientları getir
  async getAllClients(req, res) {
    try {
      const features = new APIFeatures(Client, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Client listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Clientlar getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir client getir
  async getClient(req, res) {
    try {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Client bulunamadı",
        });
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      logger.error(`Client getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Client getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni client oluştur
  async createClient(req, res) {
    try {
      const client = await Client.create(req.body);

      logger.info(`Yeni client oluşturuldu: ${client.email}`);
      res.status(201).json({
        success: true,
        data: client,
      });
    } catch (error) {
      logger.error(`Client oluşturma hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Client oluşturulurken bir hata oluştu",
      });
    }
  }

  // Client güncelle
  async updateClient(req, res) {
    try {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Client bulunamadı",
        });
      }

      await client.update(req.body);

      logger.info(`Client güncellendi: ${client.email}`);
      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      logger.error(`Client güncelleme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Client güncellenirken bir hata oluştu",
      });
    }
  }

  // Client sil
  async deleteClient(req, res) {
    try {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: "Client bulunamadı",
        });
      }

      await client.destroy();

      logger.info(`Client silindi: ${client.email}`);
      res.json({
        success: true,
        message: "Client başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Client silme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Client silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new ClientController();

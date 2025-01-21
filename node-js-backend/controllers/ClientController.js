const { Client, Package, Psychologist } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class ClientController {
  // Tüm clientları getir
  async getAllClients(req, res) {
    try {
      // Yetki kontrolü
      if (!["staff", "psychologist"].includes(req.user.type)) {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz yok",
        });
      }

      const features = new APIFeatures(Client, req.query)
        .filter()
        .search(["name", "surname", "email", "phone"])
        .sort()
        .limitFields()
        .paginate();

      const clients = await features.execute();

      res.json({
        status: true,
        message: "Danışanlar başarıyla getirildi",
        data: clients,
      });
    } catch (error) {
      logger.error(`Client listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Danışanlar alınamadı",
        error: error.message,
      });
    }
  }

  // Tek bir client getir
  async getClient(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Yetki kontrolü
      if (user.type === "client" && user.id !== parseInt(id)) {
        return res.status(403).json({
          status: false,
          message: "Başka bir danışanın bilgilerini görüntüleyemezsiniz",
        });
      }

      const client = await Client.findOne({
        where: { id },
        include: [
          {
            model: Package,
            as: "package",
            attributes: [
              "id",
              "name",
              "description",
              "session_count",
              "status",
            ],
          },
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname", "email", "phone", "image"],
          },
        ],
      });

      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Danışan bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Danışan başarıyla getirildi",
        data: client,
      });
    } catch (error) {
      logger.error(`Client getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Danışan bilgileri alınamadı",
        error: error.message,
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
      const { id } = req.params;
      const user = req.user;

      // Yetki kontrolü
      if (user.type === "client" && user.id !== parseInt(id)) {
        return res.status(403).json({
          status: false,
          message: "Başka bir danışanın bilgilerini güncelleyemezsiniz",
        });
      }

      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Danışan bulunamadı",
        });
      }

      // Staff ve psikolog sadece belirli alanları güncelleyebilir
      const allowedFields = {
        client: [
          "name",
          "surname",
          "email",
          "phone",
          "date_of_birth",
          "sex",
          "photo",
        ],
        staff: ["status", "package_id", "psyc_id", "casual_mode"],
        psychologist: ["status", "casual_mode"],
      };

      const updateData = {};
      const userType = user.type === "client" ? "client" : user.type;

      Object.keys(req.body).forEach((field) => {
        if (allowedFields[userType].includes(field)) {
          updateData[field] = req.body[field];
        }
      });

      await client.update(updateData);

      logger.info(`Client güncellendi: ${client.email}`);
      res.json({
        status: true,
        message: "Danışan başarıyla güncellendi",
        data: client,
      });
    } catch (error) {
      logger.error(`Client güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Danışan güncellenemedi",
        error: error.message,
      });
    }
  }

  // Client sil (Soft delete)
  async deleteClient(req, res) {
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

      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Danışan bulunamadı",
        });
      }

      // Soft delete - status'u inactive yap
      await client.update({ status: "inactive" });

      logger.info(`Client silindi: ${client.email}`);
      res.json({
        status: true,
        message: "Danışan başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Client silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Danışan silinemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new ClientController();

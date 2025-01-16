const { Payment } = require("../models");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PaymentController {
  // Tüm ödemeleri getir
  async getAllPayments(req, res) {
    try {
      const features = new APIFeatures(Payment, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Ödeme listesi getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Ödemeler getirilirken bir hata oluştu",
      });
    }
  }

  // Tek bir ödeme getir
  async getPayment(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Ödeme bulunamadı",
        });
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      logger.error(`Ödeme getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Ödeme getirilirken bir hata oluştu",
      });
    }
  }

  // Client'ın ödemelerini getir
  async getClientPayments(req, res) {
    try {
      // client_id'yi JWT'den al
      const client_id = req.user.id;

      if (!client_id) {
        return res.status(401).json({
          status: false,
          message: "Yetkisiz erişim",
        });
      }

      const features = new APIFeatures(Payment, {
        ...req.query,
        client_id,
      })
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json({
        status: true,
        data: result,
      });
    } catch (error) {
      logger.error(`Client ödemeleri getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Client ödemeleri getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni ödeme oluştur
  async createPayment(req, res) {
    try {
      const { package_id, amount, payment_method } = req.body;

      // Zorunlu alanları kontrol et
      if (!package_id || !amount || !payment_method) {
        return res.status(400).json({
          status: false,
          message: "package_id, amount ve payment_method alanları zorunludur",
        });
      }

      // client_id'yi JWT'den al
      const client_id = req.user.id;

      if (!client_id) {
        return res.status(401).json({
          status: false,
          message: "Yetkisiz erişim",
        });
      }

      const payment = await Payment.create({
        client_id,
        package_id,
        amount,
        payment_method,
        status: "pending",
      });

      logger.info(`Yeni ödeme oluşturuldu: ${payment.id}`);
      res.status(201).json({
        status: true,
        message: "Ödeme başarıyla oluşturuldu",
        data: payment,
      });
    } catch (error) {
      logger.error(`Ödeme oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Ödeme oluşturulurken bir hata oluştu",
      });
    }
  }

  // Ödeme güncelle
  async updatePayment(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({
          status: false,
          message: "Ödeme bulunamadı",
        });
      }

      await payment.update(req.body);

      logger.info(`Ödeme güncellendi: ${payment.id}`);
      res.json({
        status: true,
        message: "Ödeme başarıyla güncellendi",
        data: payment,
      });
    } catch (error) {
      logger.error(`Ödeme güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Ödeme güncellenirken bir hata oluştu",
      });
    }
  }

  // Ödeme sil
  async deletePayment(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({
          status: false,
          message: "Ödeme bulunamadı",
        });
      }

      await payment.destroy();

      logger.info(`Ödeme silindi: ${payment.id}`);
      res.json({
        status: true,
        message: "Ödeme başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Ödeme silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Ödeme silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new PaymentController();

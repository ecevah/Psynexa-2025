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
      const features = new APIFeatures(Payment, {
        ...req.query,
        client_id: req.params.clientId,
      })
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const result = await features.execute();

      res.json(result);
    } catch (error) {
      logger.error(`Client ödemeleri getirme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Client ödemeleri getirilirken bir hata oluştu",
      });
    }
  }

  // Yeni ödeme oluştur
  async createPayment(req, res) {
    try {
      const payment = await Payment.create(req.body);

      logger.info(`Yeni ödeme oluşturuldu: ${payment.id}`);
      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      logger.error(`Ödeme oluşturma hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Ödeme oluşturulurken bir hata oluştu",
      });
    }
  }

  // Ödeme güncelle
  async updatePayment(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Ödeme bulunamadı",
        });
      }

      await payment.update(req.body);

      logger.info(`Ödeme güncellendi: ${payment.id}`);
      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      logger.error(`Ödeme güncelleme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Ödeme güncellenirken bir hata oluştu",
      });
    }
  }

  // Ödeme sil
  async deletePayment(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Ödeme bulunamadı",
        });
      }

      await payment.destroy();

      logger.info(`Ödeme silindi: ${payment.id}`);
      res.json({
        success: true,
        message: "Ödeme başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Ödeme silme hatası: ${error.message}`);
      res.status(500).json({
        success: false,
        error: "Ödeme silinirken bir hata oluştu",
      });
    }
  }
}

module.exports = new PaymentController();

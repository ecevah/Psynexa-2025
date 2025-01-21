const { Psychologist, Staff, WorkingArea } = require("../models");
const { Op } = require("sequelize");
const APIFeatures = require("../utils/APIFeatures");
const logger = require("../config/logger");

class PsychologistApprovalController {
  // Psikoloğun onay durumunu güncelle
  async updateApprovalStatus(req, res) {
    try {
      const { psychologistId } = req.params;
      const { approve_status, approve_description } = req.body;
      const staffId = req.user.id;

      // Status kontrolü
      if (!["pending", "approved", "rejected"].includes(approve_status)) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz onay durumu",
        });
      }

      const psychologist = await Psychologist.findByPk(psychologistId);
      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
        });
      }

      // Zaten onaylanmış veya reddedilmiş psikologların durumu değiştirilemez
      if (psychologist.approve_status !== "pending") {
        return res.status(400).json({
          status: false,
          message: "Sadece bekleyen psikologların onay durumu değiştirilebilir",
        });
      }

      await psychologist.update({
        approve_status,
        approve_description,
        approve_by: staffId,
        status: approve_status === "approved" ? "active" : "inactive",
      });

      const updatedPsychologist = await Psychologist.findByPk(psychologistId, {
        include: [
          {
            model: Staff,
            as: "approver",
            attributes: ["id", "name", "surname"],
          },
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

      return res.json({
        status: true,
        message: "Psikolog onay durumu güncellendi",
        data: updatedPsychologist,
      });
    } catch (error) {
      logger.error("Onay durumu güncelleme hatası:", error);
      return res.status(500).json({
        status: false,
        message: "Onay durumu güncellenemedi",
        error: error.message,
      });
    }
  }

  // Onay bekleyen psikologları listele
  async getPendingPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter({ approve_status: "pending" })
        .search(["name", "surname", "email", "phone"])
        .sort()
        .paginate();

      const pendingPsychologists = await features.query({
        include: [
          {
            model: Staff,
            as: "approver",
            attributes: ["id", "name", "surname"],
          },
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

      const total = await Psychologist.count({
        where: { approve_status: "pending" },
      });

      return res.json({
        status: true,
        message: "Onay bekleyen psikologlar listelendi",
        data: pendingPsychologists,
        total,
        page: features.queryString.page || 1,
        limit: features.queryString.limit || 10,
      });
    } catch (error) {
      logger.error("Onay bekleyen psikologlar listeleme hatası:", error);
      return res.status(500).json({
        status: false,
        message: "Onay bekleyen psikologlar listelenemedi",
        error: error.message,
      });
    }
  }

  // Onaylı psikologları listele
  async getApprovedPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter({ approve_status: "approved" })
        .search(["name", "surname", "email", "phone"])
        .sort()
        .paginate();

      const approvedPsychologists = await features.query({
        include: [
          {
            model: Staff,
            as: "approver",
            attributes: ["id", "name", "surname"],
          },
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

      const total = await Psychologist.count({
        where: { approve_status: "approved" },
      });

      return res.json({
        status: true,
        message: "Onaylı psikologlar listelendi",
        data: approvedPsychologists,
        total,
        page: features.queryString.page || 1,
        limit: features.queryString.limit || 10,
      });
    } catch (error) {
      logger.error("Onaylı psikologlar listeleme hatası:", error);
      return res.status(500).json({
        status: false,
        message: "Onaylı psikologlar listelenemedi",
        error: error.message,
      });
    }
  }

  // Reddedilen psikologları listele
  async getRejectedPsychologists(req, res) {
    try {
      const features = new APIFeatures(Psychologist, req.query)
        .filter({ approve_status: "rejected" })
        .search(["name", "surname", "email", "phone"])
        .sort()
        .paginate();

      const rejectedPsychologists = await features.query({
        include: [
          {
            model: Staff,
            as: "approver",
            attributes: ["id", "name", "surname"],
          },
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

      const total = await Psychologist.count({
        where: { approve_status: "rejected" },
      });

      return res.json({
        status: true,
        message: "Reddedilen psikologlar listelendi",
        data: rejectedPsychologists,
        total,
        page: features.queryString.page || 1,
        limit: features.queryString.limit || 10,
      });
    } catch (error) {
      logger.error("Reddedilen psikologlar listeleme hatası:", error);
      return res.status(500).json({
        status: false,
        message: "Reddedilen psikologlar listelenemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new PsychologistApprovalController();

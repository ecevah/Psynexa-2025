const { Psychologist, Staff, WorkingArea } = require("../models");
const { Op } = require("sequelize");
const APIFeatures = require("../utils/APIFeatures");

// Psikoloğun onay durumunu güncelle
const updateApprovalStatus = async (req, res) => {
  try {
    const { psychologistId } = req.params;
    const { approve_status, approve_description } = req.body;
    const staffId = req.user.id;

    // Status kontrolü
    if (!["pending", "approved", "rejected"].includes(approve_status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz onay durumu",
      });
    }

    const psychologist = await Psychologist.findByPk(psychologistId);
    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: "Psikolog bulunamadı",
      });
    }

    await psychologist.update({
      approve_status,
      approve_description,
      approve_by: staffId,
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
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });

    return res.json({
      success: true,
      message: "Psikolog onay durumu güncellendi",
      data: updatedPsychologist,
    });
  } catch (error) {
    console.error("Onay durumu güncellenirken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
      error: error.message,
    });
  }
};

// Onay bekleyen psikologları listele
const getPendingPsychologists = async (req, res) => {
  try {
    const features = new APIFeatures(Psychologist, req.query)
      .filter({ approve_status: "pending" })
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
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });

    const total = await Psychologist.count({
      where: { approve_status: "pending" },
    });

    return res.json({
      success: true,
      message: "Onay bekleyen psikologlar listelendi",
      data: pendingPsychologists,
      total,
      page: features.queryString.page || 1,
      limit: features.queryString.limit || 10,
    });
  } catch (error) {
    console.error("Onay bekleyen psikologlar listelenirken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
      error: error.message,
    });
  }
};

// Onaylı psikologları listele
const getApprovedPsychologists = async (req, res) => {
  try {
    const features = new APIFeatures(Psychologist, req.query)
      .filter({ approve_status: "approved" })
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
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });

    const total = await Psychologist.count({
      where: { approve_status: "approved" },
    });

    return res.json({
      success: true,
      message: "Onaylı psikologlar listelendi",
      data: approvedPsychologists,
      total,
      page: features.queryString.page || 1,
      limit: features.queryString.limit || 10,
    });
  } catch (error) {
    console.error("Onaylı psikologlar listelenirken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
      error: error.message,
    });
  }
};

// Reddedilen psikologları listele
const getRejectedPsychologists = async (req, res) => {
  try {
    const features = new APIFeatures(Psychologist, req.query)
      .filter({ approve_status: "rejected" })
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
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });

    const total = await Psychologist.count({
      where: { approve_status: "rejected" },
    });

    return res.json({
      success: true,
      message: "Reddedilen psikologlar listelendi",
      data: rejectedPsychologists,
      total,
      page: features.queryString.page || 1,
      limit: features.queryString.limit || 10,
    });
  } catch (error) {
    console.error("Reddedilen psikologlar listelenirken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
      error: error.message,
    });
  }
};

module.exports = {
  updateApprovalStatus,
  getPendingPsychologists,
  getApprovedPsychologists,
  getRejectedPsychologists,
};

const BaseController = require("./BaseController");
const { Staff, Restrictions } = require("../models");
const logger = require("../config/logger");
const bcrypt = require("bcryptjs");

class StaffController extends BaseController {
  constructor() {
    super(Staff, "Staff");
  }

  async getAll(req, res) {
    try {
      const staff = await Staff.findAll({
        where: {
          status: ["active", "inactive"],
        },
        include: [
          {
            model: Restrictions,
            as: "restrictions",
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });
      logger.info("Retrieved all staff members successfully");
      return res.status(200).json({
        status: true,
        message: "Personel listesi başarıyla getirildi",
        data: staff,
      });
    } catch (error) {
      logger.error(`Error retrieving staff members: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel listesi getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const staff = await Staff.findOne({
        where: {
          id: req.params.id,
          status: ["active", "inactive"],
        },
        include: [
          {
            model: Restrictions,
            as: "restrictions",
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });
      if (!staff) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Personel bulunamadı",
        });
      }
      logger.info(`Retrieved staff member with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Personel başarıyla getirildi",
        data: staff,
      });
    } catch (error) {
      logger.error(`Error retrieving staff member: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const { password, ...staffData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const staff = await Staff.create({
        ...staffData,
        password: hashedPassword,
        created_by: req.user.id,
        created_type: "staff",
      });

      const staffWithRestrictions = await Staff.findByPk(staff.id, {
        include: [
          {
            model: Restrictions,
            as: "restrictions",
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });

      logger.info(`Created new staff member with id: ${staff.id}`);
      return res.status(201).json({
        status: true,
        message: "Personel başarıyla oluşturuldu",
        data: staffWithRestrictions,
      });
    } catch (error) {
      logger.error(`Error creating staff member: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel oluşturulurken bir hata oluştu",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { password, ...updateData } = req.body;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      updateData.updated_by = req.user.id;

      const [updated] = await Staff.update(updateData, {
        where: {
          id: req.params.id,
          status: ["active", "inactive"],
        },
      });

      if (!updated) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Personel bulunamadı",
        });
      }

      const updatedStaff = await Staff.findByPk(req.params.id, {
        include: [
          {
            model: Restrictions,
            as: "restrictions",
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });
      logger.info(`Updated staff member with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Personel başarıyla güncellendi",
        data: updatedStaff,
      });
    } catch (error) {
      logger.error(`Error updating staff member: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel güncellenirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const [updated] = await Staff.update(
        {
          status: "deleted",
          updated_by: req.user.id,
        },
        {
          where: {
            id: req.params.id,
            status: ["active", "inactive"],
          },
        }
      );

      if (!updated) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Personel bulunamadı",
        });
      }

      logger.info(`Deleted staff member with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Personel başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Error deleting staff member: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel silinirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz durum değeri. 'active' veya 'inactive' olmalıdır",
        });
      }

      const [updated] = await Staff.update(
        {
          status,
          updated_by: req.user.id,
        },
        {
          where: {
            id: req.params.id,
            status: ["active", "inactive"],
          },
        }
      );

      if (!updated) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Personel bulunamadı",
        });
      }

      logger.info(`Updated staff member status with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Personel durumu başarıyla güncellendi",
      });
    } catch (error) {
      logger.error(`Error updating staff member status: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Personel durumu güncellenirken bir hata oluştu",
        error: error.message,
      });
    }
  }
}

module.exports = new StaffController();

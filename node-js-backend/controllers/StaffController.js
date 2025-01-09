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
        include: [
          {
            model: Restrictions,
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });
      logger.info("Retrieved all staff members successfully");
      return res.status(200).json(staff);
    } catch (error) {
      logger.error(`Error retrieving staff members: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving staff members" });
    }
  }

  async getById(req, res) {
    try {
      const staff = await Staff.findByPk(req.params.id, {
        include: [
          {
            model: Restrictions,
            attributes: { exclude: ["created_at", "updated_at"] },
          },
        ],
      });
      if (!staff) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Staff member not found" });
      }
      logger.info(`Retrieved staff member with id: ${req.params.id}`);
      return res.status(200).json(staff);
    } catch (error) {
      logger.error(`Error retrieving staff member: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving staff member" });
    }
  }

  async create(req, res) {
    try {
      const { password, ...staffData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const staff = await Staff.create({
        ...staffData,
        password: hashedPassword,
      });

      logger.info(`Created new staff member with id: ${staff.id}`);
      return res.status(201).json(staff);
    } catch (error) {
      logger.error(`Error creating staff member: ${error.message}`);
      return res.status(500).json({ error: "Error creating staff member" });
    }
  }

  async update(req, res) {
    try {
      const { password, ...updateData } = req.body;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const [updated] = await Staff.update(updateData, {
        where: { id: req.params.id },
      });

      if (!updated) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Staff member not found" });
      }

      const updatedStaff = await Staff.findByPk(req.params.id, {
        include: [Restrictions],
      });
      logger.info(`Updated staff member with id: ${req.params.id}`);
      return res.status(200).json(updatedStaff);
    } catch (error) {
      logger.error(`Error updating staff member: ${error.message}`);
      return res.status(500).json({ error: "Error updating staff member" });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await Staff.destroy({
        where: { id: req.params.id },
      });

      if (!deleted) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Staff member not found" });
      }

      logger.info(`Deleted staff member with id: ${req.params.id}`);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting staff member: ${error.message}`);
      return res.status(500).json({ error: "Error deleting staff member" });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const [updated] = await Staff.update(
        { status },
        { where: { id: req.params.id } }
      );

      if (!updated) {
        logger.warn(`Staff member not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Staff member not found" });
      }

      logger.info(`Updated staff member status with id: ${req.params.id}`);
      return res
        .status(200)
        .json({ message: "Staff status updated successfully" });
    } catch (error) {
      logger.error(`Error updating staff member status: ${error.message}`);
      return res.status(500).json({ error: "Error updating staff status" });
    }
  }
}

module.exports = new StaffController();

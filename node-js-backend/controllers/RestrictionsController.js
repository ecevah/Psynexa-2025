const BaseController = require("./BaseController");
const { Restrictions, Staff } = require("../models");
const logger = require("../config/logger");

class RestrictionsController extends BaseController {
  constructor() {
    super(Restrictions, "Restrictions");
  }

  async getAll(req, res) {
    try {
      const restrictions = await Restrictions.findAll({
        include: [
          {
            model: Staff,
            as: "staff",
            attributes: ["id", "name", "email"],
          },
        ],
      });
      logger.info("Retrieved all restrictions successfully");
      return res.status(200).json({
        status: true,
        message: "Restrictions fetched successfully",
        data: restrictions,
      });
    } catch (error) {
      logger.error(`Error retrieving restrictions: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Error retrieving restrictions",
      });
    }
  }

  async getById(req, res) {
    try {
      const restrictions = await Restrictions.findByPk(req.params.id, {
        include: [
          {
            model: Staff,
            as: "staff",
            attributes: ["id", "name", "email"],
          },
        ],
      });
      if (!restrictions) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Restrictions not found",
        });
      }
      logger.info(`Retrieved restrictions with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Restrictions fetched successfully",
        data: restrictions,
      });
    } catch (error) {
      logger.error(`Error retrieving restrictions: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Error retrieving restrictions",
      });
    }
  }

  async create(req, res) {
    try {
      const staffId = req.staff?.id;

      const restrictionsData = {
        ...req.body,
        created_by: staffId,
        updated_by: staffId,
      };

      logger.info(`Creating restrictions with data:`, restrictionsData);

      const restrictions = await Restrictions.create(restrictionsData);

      const result = await Restrictions.findByPk(restrictions.id, {
        include: [
          {
            model: Staff,
            as: "staff",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      logger.info(`Created new restrictions with id: ${restrictions.id}`);
      return res.status(201).json({
        status: true,
        message: "Restrictions created successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`Error creating restrictions: ${error.message}`);

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          status: false,
          message: "Validation error",
          errors: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
            value: e.value,
          })),
        });
      }

      return res.status(500).json({
        status: false,
        message: error.message || "Error creating restrictions",
      });
    }
  }

  async update(req, res) {
    try {
      const staffId = req.staff?.id;

      const updateData = {
        ...req.body,
        updated_by: staffId,
      };

      const [updated] = await Restrictions.update(updateData, {
        where: { id: req.params.id },
      });

      if (!updated) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Restrictions not found",
        });
      }

      const updatedRestrictions = await Restrictions.findByPk(req.params.id, {
        include: [
          {
            model: Staff,
            as: "staff",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      logger.info(`Updated restrictions with id: ${req.params.id}`);
      return res.status(200).json({
        status: true,
        message: "Restrictions updated successfully",
        data: updatedRestrictions,
      });
    } catch (error) {
      logger.error(`Error updating restrictions: ${error.message}`);
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          status: false,
          message: "Validation error",
          errors: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        });
      }
      return res.status(500).json({
        status: false,
        message: error.message || "Error updating restrictions",
      });
    }
  }

  async delete(req, res) {
    try {
      const staffCount = await Staff.count({
        where: { restrictions_id: req.params.id },
      });

      if (staffCount > 0) {
        logger.warn(
          `Cannot delete restrictions with id ${req.params.id} as it is assigned to staff members`
        );
        return res.status(400).json({
          status: false,
          message:
            "Cannot delete restrictions that are assigned to staff members",
        });
      }

      const deleted = await Restrictions.destroy({
        where: { id: req.params.id },
      });

      if (!deleted) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({
          status: false,
          message: "Restrictions not found",
        });
      }

      logger.info(`Deleted restrictions with id: ${req.params.id}`);
      return res.status(204).json({
        status: true,
        message: "Restrictions deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting restrictions: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Error deleting restrictions",
      });
    }
  }
}

module.exports = new RestrictionsController();

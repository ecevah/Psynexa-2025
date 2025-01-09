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
            attributes: ["id", "name", "email"],
          },
        ],
      });
      logger.info("Retrieved all restrictions successfully");
      return res.status(200).json(restrictions);
    } catch (error) {
      logger.error(`Error retrieving restrictions: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving restrictions" });
    }
  }

  async getById(req, res) {
    try {
      const restrictions = await Restrictions.findByPk(req.params.id, {
        include: [
          {
            model: Staff,
            attributes: ["id", "name", "email"],
          },
        ],
      });
      if (!restrictions) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Restrictions not found" });
      }
      logger.info(`Retrieved restrictions with id: ${req.params.id}`);
      return res.status(200).json(restrictions);
    } catch (error) {
      logger.error(`Error retrieving restrictions: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving restrictions" });
    }
  }

  async create(req, res) {
    try {
      const restrictions = await Restrictions.create(req.body);
      logger.info(`Created new restrictions with id: ${restrictions.id}`);
      return res.status(201).json(restrictions);
    } catch (error) {
      logger.error(`Error creating restrictions: ${error.message}`);
      return res.status(500).json({ error: "Error creating restrictions" });
    }
  }

  async update(req, res) {
    try {
      const [updated] = await Restrictions.update(req.body, {
        where: { id: req.params.id },
      });

      if (!updated) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Restrictions not found" });
      }

      const updatedRestrictions = await Restrictions.findByPk(req.params.id, {
        include: [
          {
            model: Staff,
            attributes: ["id", "name", "email"],
          },
        ],
      });
      logger.info(`Updated restrictions with id: ${req.params.id}`);
      return res.status(200).json(updatedRestrictions);
    } catch (error) {
      logger.error(`Error updating restrictions: ${error.message}`);
      return res.status(500).json({ error: "Error updating restrictions" });
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
          error:
            "Cannot delete restrictions that are assigned to staff members",
        });
      }

      const deleted = await Restrictions.destroy({
        where: { id: req.params.id },
      });

      if (!deleted) {
        logger.warn(`Restrictions not found with id: ${req.params.id}`);
        return res.status(404).json({ error: "Restrictions not found" });
      }

      logger.info(`Deleted restrictions with id: ${req.params.id}`);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting restrictions: ${error.message}`);
      return res.status(500).json({ error: "Error deleting restrictions" });
    }
  }
}

module.exports = new RestrictionsController();

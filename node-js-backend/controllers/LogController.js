const BaseController = require("./BaseController");
const { Log, Client } = require("../models");
const logger = require("../config/logger");
const { Op } = require("sequelize");

class LogController extends BaseController {
  constructor() {
    super(Log, "Log");
  }

  async getByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const logs = await Log.findAll({
        where: {
          timestamp: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        order: [["timestamp", "DESC"]],
      });
      logger.info(`Retrieved logs between ${startDate} and ${endDate}`);
      return res.status(200).json(logs);
    } catch (error) {
      logger.error(`Error retrieving logs by date range: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Error retrieving logs by date range" });
    }
  }

  async getByClient(req, res) {
    try {
      const logs = await Log.findAll({
        where: { client_id: req.params.clientId },
        include: [
          {
            model: Client,
            attributes: ["name", "surname", "email"],
          },
        ],
        order: [["timestamp", "DESC"]],
      });
      logger.info(`Retrieved logs for client id: ${req.params.clientId}`);
      return res.status(200).json(logs);
    } catch (error) {
      logger.error(`Error retrieving logs by client: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving logs by client" });
    }
  }

  async getByMethod(req, res) {
    try {
      const logs = await Log.findAll({
        where: { method: req.params.method.toUpperCase() },
        order: [["timestamp", "DESC"]],
      });
      logger.info(`Retrieved logs for method: ${req.params.method}`);
      return res.status(200).json(logs);
    } catch (error) {
      logger.error(`Error retrieving logs by method: ${error.message}`);
      return res.status(500).json({ error: "Error retrieving logs by method" });
    }
  }

  async getByResponseCode(req, res) {
    try {
      const logs = await Log.findAll({
        where: { response_code: req.params.code },
        order: [["timestamp", "DESC"]],
      });
      logger.info(`Retrieved logs for response code: ${req.params.code}`);
      return res.status(200).json(logs);
    } catch (error) {
      logger.error(`Error retrieving logs by response code: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Error retrieving logs by response code" });
    }
  }
}

module.exports = new LogController();

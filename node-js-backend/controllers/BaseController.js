const logger = require("../config/logger");

class BaseController {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async getAll(req, res) {
    try {
      const items = await this.model.findAll();
      logger.info(`Retrieved all ${this.modelName}s successfully`);
      return res.status(200).json(items);
    } catch (error) {
      logger.error(`Error retrieving ${this.modelName}s: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error retrieving ${this.modelName}s` });
    }
  }

  async getById(req, res) {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        logger.warn(`${this.modelName} not found with id: ${req.params.id}`);
        return res.status(404).json({ error: `${this.modelName} not found` });
      }
      logger.info(`Retrieved ${this.modelName} with id: ${req.params.id}`);
      return res.status(200).json(item);
    } catch (error) {
      logger.error(`Error retrieving ${this.modelName}: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error retrieving ${this.modelName}` });
    }
  }

  async create(req, res) {
    try {
      const item = await this.model.create(req.body);
      logger.info(`Created new ${this.modelName} with id: ${item.id}`);
      return res.status(201).json(item);
    } catch (error) {
      logger.error(`Error creating ${this.modelName}: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error creating ${this.modelName}` });
    }
  }

  async update(req, res) {
    try {
      const [updated] = await this.model.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        logger.warn(`${this.modelName} not found with id: ${req.params.id}`);
        return res.status(404).json({ error: `${this.modelName} not found` });
      }
      const updatedItem = await this.model.findByPk(req.params.id);
      logger.info(`Updated ${this.modelName} with id: ${req.params.id}`);
      return res.status(200).json(updatedItem);
    } catch (error) {
      logger.error(`Error updating ${this.modelName}: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error updating ${this.modelName}` });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await this.model.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        logger.warn(`${this.modelName} not found with id: ${req.params.id}`);
        return res.status(404).json({ error: `${this.modelName} not found` });
      }
      logger.info(`Deleted ${this.modelName} with id: ${req.params.id}`);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error deleting ${this.modelName}` });
    }
  }
}

module.exports = BaseController;

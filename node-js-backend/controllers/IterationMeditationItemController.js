const { IterationMeditationItem, IterationMeditation } = require("../models");
const logger = require("../config/logger");
const { deleteFile } = require("../config/multer");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

class IterationMeditationItemController {
  async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { meditation_id, title, description, order, timer, content_type } =
        req.body;
      const create_by = req.user?.id;
      const create_role = req.user?.type;

      if (create_role !== "psychologist") {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "Only psychologists can create meditation items",
        });
      }

      // Check if meditation exists and belongs to the psychologist
      const meditation = await IterationMeditation.findByPk(meditation_id);
      if (!meditation) {
        await transaction.rollback();
        return res.status(404).json({
          status: false,
          message: "Iteration meditation not found",
        });
      }

      if (meditation.psyc_id !== req.user?.id) {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "You can only add items to your own meditations",
        });
      }

      // Create item with file URLs
      const item = await IterationMeditationItem.create(
        {
          meditation_id,
          title,
          description,
          media_url:
            req.files?.media?.[0]?.path?.replace("public/", "") || null,
          description_sound_url:
            req.files?.description_sound?.[0]?.path?.replace("public/", "") ||
            null,
          background_sound_url:
            req.files?.background_sound?.[0]?.path?.replace("public/", "") ||
            null,
          vocalization_url:
            req.files?.vocalization?.[0]?.path?.replace("public/", "") || null,
          sound_url:
            req.files?.sound?.[0]?.path?.replace("public/", "") || null,
          content_url:
            req.files?.content?.[0]?.path?.replace("public/", "") || null,
          order,
          timer,
          content_type,
          create_by,
          create_role,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`New iteration meditation item created: ${item.id}`);
      res.status(201).json({
        status: true,
        message: "Iteration meditation item created successfully",
        data: item,
      });
    } catch (error) {
      await transaction.rollback();
      logger.error("Error in create item:", error);

      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            if (file?.path) {
              deleteFile(file.path);
            }
          });
        });
      }

      res.status(500).json({
        status: false,
        message: "Failed to create iteration meditation item",
      });
    }
  }

  async getAll(req, res) {
    try {
      const { meditation_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await IterationMeditationItem.findAndCountAll({
        where: { meditation_id },
        order: [["order", "ASC"]],
        limit: parseInt(limit),
        offset,
      });

      res.json({
        status: true,
        message: "Iteration meditation items retrieved successfully",
        data: {
          items: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error in getAll items:", error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve iteration meditation items",
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const item = await IterationMeditationItem.findByPk(id);
      if (!item) {
        return res.status(404).json({
          status: false,
          message: "Iteration meditation item not found",
        });
      }

      res.json({
        status: true,
        message: "Iteration meditation item retrieved successfully",
        data: item,
      });
    } catch (error) {
      logger.error("Error in getById item:", error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve iteration meditation item",
      });
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, description, order, timer, content_type } = req.body;
      const update_by = req.user?.id;
      const update_role = req.user?.type;

      if (update_role !== "psychologist") {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "Only psychologists can update meditation items",
        });
      }

      const item = await IterationMeditationItem.findByPk(id, {
        include: [
          {
            model: IterationMeditation,
            as: "meditation",
          },
        ],
      });

      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          status: false,
          message: "Iteration meditation item not found",
        });
      }

      if (item.meditation.psyc_id !== req.user?.id) {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "You can only update items from your own meditations",
        });
      }

      // Update item with new file URLs if provided
      const updateData = {
        title,
        description,
        order,
        timer,
        content_type,
        update_by,
        update_role,
      };

      if (req.files?.media?.[0]) {
        if (item.media_url) deleteFile(`public/${item.media_url}`);
        updateData.media_url = req.files.media[0].path.replace("public/", "");
      }

      if (req.files?.description_sound?.[0]) {
        if (item.description_sound_url)
          deleteFile(`public/${item.description_sound_url}`);
        updateData.description_sound_url =
          req.files.description_sound[0].path.replace("public/", "");
      }

      if (req.files?.background_sound?.[0]) {
        if (item.background_sound_url)
          deleteFile(`public/${item.background_sound_url}`);
        updateData.background_sound_url =
          req.files.background_sound[0].path.replace("public/", "");
      }

      if (req.files?.vocalization?.[0]) {
        if (item.vocalization_url)
          deleteFile(`public/${item.vocalization_url}`);
        updateData.vocalization_url = req.files.vocalization[0].path.replace(
          "public/",
          ""
        );
      }

      if (req.files?.sound?.[0]) {
        if (item.sound_url) deleteFile(`public/${item.sound_url}`);
        updateData.sound_url = req.files.sound[0].path.replace("public/", "");
      }

      if (req.files?.content?.[0]) {
        if (item.content_url) deleteFile(`public/${item.content_url}`);
        updateData.content_url = req.files.content[0].path.replace(
          "public/",
          ""
        );
      }

      await item.update(updateData, { transaction });
      await transaction.commit();

      logger.info(`Iteration meditation item updated: ${id}`);
      res.json({
        status: true,
        message: "Iteration meditation item updated successfully",
        data: item,
      });
    } catch (error) {
      await transaction.rollback();
      logger.error("Error in update item:", error);

      if (req.files) {
        Object.values(req.files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            if (file?.path) {
              deleteFile(file.path);
            }
          });
        });
      }

      res.status(500).json({
        status: false,
        message: "Failed to update iteration meditation item",
      });
    }
  }

  async delete(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (req.user?.type !== "psychologist") {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "Only psychologists can delete meditation items",
        });
      }

      const item = await IterationMeditationItem.findByPk(id, {
        include: [
          {
            model: IterationMeditation,
            as: "meditation",
          },
        ],
      });

      if (!item) {
        await transaction.rollback();
        return res.status(404).json({
          status: false,
          message: "Iteration meditation item not found",
        });
      }

      if (item.meditation.psyc_id !== req.user?.id) {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "You can only delete items from your own meditations",
        });
      }

      // Delete associated files
      if (item.media_url) deleteFile(`public/${item.media_url}`);
      if (item.description_sound_url)
        deleteFile(`public/${item.description_sound_url}`);
      if (item.background_sound_url)
        deleteFile(`public/${item.background_sound_url}`);
      if (item.vocalization_url) deleteFile(`public/${item.vocalization_url}`);
      if (item.sound_url) deleteFile(`public/${item.sound_url}`);
      if (item.content_url) deleteFile(`public/${item.content_url}`);

      await item.destroy({ transaction });
      await transaction.commit();

      logger.info(`Iteration meditation item deleted: ${id}`);
      res.json({
        status: true,
        message: "Iteration meditation item deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      logger.error("Error in delete item:", error);
      res.status(500).json({
        status: false,
        message: "Failed to delete iteration meditation item",
      });
    }
  }
}

module.exports = new IterationMeditationItemController();

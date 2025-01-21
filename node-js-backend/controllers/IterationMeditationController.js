const {
  IterationMeditation,
  IterationMeditationItem,
  Psychologist,
} = require("../models");
const logger = require("../config/logger");
const { deleteFile } = require("../config/multer");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const path = require("path");
const fs = require("fs");

class IterationMeditationController {
  async create(req, res) {
    try {
      const { id, type } = req.user;
      const { title, description, items } = req.body;

      if (type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlemi sadece psikologlar yapabilir",
        });
      }

      let parsedItems;
      try {
        parsedItems = JSON.parse(items);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz items formatı",
        });
      }

      const meditation = await IterationMeditation.create({
        psyc_id: id,
        title,
        description,
        background_sound_url: req.files?.background_sound
          ? `/uploads/${req.files.background_sound[0].filename}`
          : null,
        status: "active",
        create_by: id,
        create_role: type,
      });

      if (req.files?.background_sound) {
        const backgroundSound = req.files.background_sound[0];
        const backgroundSoundPath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          backgroundSound.filename
        );
        await fs.promises.rename(backgroundSound.path, backgroundSoundPath);
      }

      const files = req.files?.files || [];
      const fileArray = Array.isArray(files) ? files : [files];

      const createdItems = await Promise.all(
        parsedItems.map(async (item, index) => {
          const file = fileArray[index];
          let mediaUrl = null;

          if (file) {
            const filePath = path.join(
              __dirname,
              "..",
              "public",
              "uploads",
              file.filename
            );
            await fs.promises.rename(file.path, filePath);
            mediaUrl = `/uploads/${file.filename}`;
          }

          return IterationMeditationItem.create({
            meditation_id: meditation.id,
            title: item.title,
            description: item.description,
            media_url: mediaUrl,
            order: item.order,
            timer: item.timer,
            content_type: item.content_type,
            status: "active",
            create_by: id,
            create_role: type,
          });
        })
      );

      return res.status(201).json({
        status: true,
        message: "Meditasyon başarıyla oluşturuldu",
        data: {
          meditation,
          items: createdItems,
        },
      });
    } catch (error) {
      logger.error("Error in create:", error);
      return res.status(500).json({
        status: false,
        message: "Meditasyon oluşturulurken bir hata oluştu",
      });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {
        ...(search && {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }),
      };

      const { count, rows } = await IterationMeditation.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
          {
            model: IterationMeditationItem,
            as: "items",
            order: [["order", "ASC"]],
          },
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      res.json({
        status: true,
        message: "Iteration meditations retrieved successfully",
        data: {
          meditations: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error in getAll:", error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve iteration meditations",
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
          status: false,
          message: "Invalid ID format",
        });
      }

      const meditation = await IterationMeditation.findByPk(id, {
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
          {
            model: IterationMeditationItem,
            as: "items",
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!meditation) {
        return res.status(404).json({
          status: false,
          message: "Iteration meditation not found",
        });
      }

      res.json({
        status: true,
        message: "Iteration meditation retrieved successfully",
        data: meditation,
      });
    } catch (error) {
      logger.error("Error in getById:", error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve iteration meditation",
      });
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, description, items } = req.body;
      const update_by = req.user?.id;
      const update_role = req.user?.type;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
          status: false,
          message: "Invalid ID format",
        });
      }

      const meditation = await IterationMeditation.findByPk(id, {
        include: [
          {
            model: IterationMeditationItem,
            as: "items",
          },
        ],
        transaction,
      });

      if (!meditation) {
        await transaction.rollback();
        return res.status(404).json({
          status: false,
          message: "Iteration meditation not found",
        });
      }

      if (
        meditation.psyc_id !== req.user?.id ||
        update_role !== "psychologist"
      ) {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "You can only update your own meditations",
        });
      }

      const updateData = {
        title,
        description,
        update_by,
        update_role,
      };

      if (req.files?.background_sound?.[0]) {
        if (meditation.background_sound_url) {
          deleteFile(`public/${meditation.background_sound_url}`);
        }
        updateData.background_sound_url =
          req.files.background_sound[0].path.replace("public/", "");
      }

      await meditation.update(updateData, { transaction });

      if (items) {
        const parsedItems = JSON.parse(items);

        // Delete old items and their files
        for (const item of meditation.items) {
          if (item.media_url) {
            deleteFile(`public/${item.media_url}`);
          }
          if (item.description_sound_url) {
            deleteFile(`public/${item.description_sound_url}`);
          }
          await item.destroy({ transaction });
        }

        // Create new items
        const itemPromises = parsedItems.map(async (item, index) => {
          const mediaFile = req.files[`item_media_${index + 1}`]?.[0];
          const descSoundFile =
            req.files[`item_description_sound_${index + 1}`]?.[0];

          return IterationMeditationItem.create(
            {
              meditation_id: meditation.id,
              title: item.title,
              description: item.description,
              media_url: mediaFile?.path?.replace("public/", "") || null,
              description_sound_url:
                descSoundFile?.path?.replace("public/", "") || null,
              order: item.order,
              timer: item.timer,
              content_type: item.content_type,
              create_by: update_by,
              create_role: update_role,
            },
            { transaction }
          );
        });

        await Promise.all(itemPromises);
      }

      await transaction.commit();

      const result = await IterationMeditation.findByPk(id, {
        include: [
          {
            model: IterationMeditationItem,
            as: "items",
            order: [["order", "ASC"]],
          },
        ],
      });

      logger.info(`Iteration meditation updated: ${id}`);
      res.json({
        status: true,
        message: "Iteration meditation updated successfully",
        data: result,
      });
    } catch (error) {
      await transaction.rollback();
      logger.error("Error in update:", error);

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
        message: "Failed to update iteration meditation",
      });
    }
  }

  async delete(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
          status: false,
          message: "Invalid ID format",
        });
      }

      const meditation = await IterationMeditation.findByPk(id, {
        include: [
          {
            model: IterationMeditationItem,
            as: "items",
          },
        ],
        transaction,
      });

      if (!meditation) {
        await transaction.rollback();
        return res.status(404).json({
          status: false,
          message: "Iteration meditation not found",
        });
      }

      if (
        meditation.psyc_id !== req.user?.id ||
        req.user?.type !== "psychologist"
      ) {
        await transaction.rollback();
        return res.status(403).json({
          status: false,
          message: "You can only delete your own meditations",
        });
      }

      // Delete all associated files
      if (meditation.background_sound_url) {
        deleteFile(`public/${meditation.background_sound_url}`);
      }

      for (const item of meditation.items) {
        if (item.media_url) {
          deleteFile(`public/${item.media_url}`);
        }
        if (item.description_sound_url) {
          deleteFile(`public/${item.description_sound_url}`);
        }
      }

      await meditation.destroy({ transaction });
      await transaction.commit();

      logger.info(`Iteration meditation deleted: ${id}`);
      res.json({
        status: true,
        message: "Iteration meditation deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      logger.error("Error in delete:", error);
      res.status(500).json({
        status: false,
        message: "Failed to delete iteration meditation",
      });
    }
  }

  async getByPsychologist(req, res) {
    try {
      const psyc_id = req.user?.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      if (!psyc_id || req.user?.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Only psychologists can access this endpoint",
        });
      }

      const { count, rows } = await IterationMeditation.findAndCountAll({
        where: { psyc_id },
        include: [
          {
            model: IterationMeditationItem,
            as: "items",
            order: [["order", "ASC"]],
          },
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      res.json({
        status: true,
        message: "Psychologist's iteration meditations retrieved successfully",
        data: {
          meditations: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error("Error in getByPsychologist:", error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve psychologist's iteration meditations",
      });
    }
  }
}

module.exports = new IterationMeditationController();

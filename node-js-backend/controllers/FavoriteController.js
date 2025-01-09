const { Favorite, Meditation } = require("../models");
const logger = require("../config/logger");

class FavoriteController {
  // Yeni favori oluştur
  async createFavorite(req, res) {
    try {
      const client_id = req.user.id;
      const {
        series_id,
        content_id,
        meditation_id,
        breathing_exercises_id,
        meditation_iterations_id,
        type,
      } = req.body;

      // Favori zaten var mı kontrol et
      const existingFavorite = await Favorite.findOne({
        where: {
          client_id,
          [type === "series"
            ? "series_id"
            : type === "content"
            ? "content_id"
            : type === "meditation"
            ? "meditation_id"
            : type === "breathing"
            ? "breathing_exercises_id"
            : "meditation_iterations_id"]: req.body[`${type}_id`],
          type,
          active: true,
        },
      });

      if (existingFavorite) {
        return res.status(400).json({ error: "Bu içerik zaten favorilerde" });
      }

      const favorite = await Favorite.create({
        client_id,
        series_id,
        content_id,
        meditation_id,
        breathing_exercises_id,
        meditation_iterations_id,
        type,
        created_by: client_id,
      });

      logger.info(`Yeni favori oluşturuldu: ${favorite.id}`);
      res.status(201).json(favorite);
    } catch (error) {
      logger.error(`Favori oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Favori oluşturulamadı" });
    }
  }

  // Danışanın favorilerini getir
  async getFavorites(req, res) {
    try {
      const client_id = req.user.id;
      const { type } = req.query;

      const whereClause = {
        client_id,
        active: true,
        status: "active",
      };

      if (type) {
        whereClause.type = type;
      }

      const favorites = await Favorite.findAll({
        where: whereClause,
        include: [
          {
            model: Meditation,
            attributes: ["id", "title", "description"],
            required: false,
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(favorites);
    } catch (error) {
      logger.error(`Favori listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Favoriler alınamadı" });
    }
  }

  // Favori detayı
  async getFavorite(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const favorite = await Favorite.findOne({
        where: { id, client_id },
        include: [
          {
            model: Meditation,
            attributes: ["id", "title", "description"],
            required: false,
          },
        ],
      });

      if (!favorite) {
        return res.status(404).json({ error: "Favori bulunamadı" });
      }

      res.json(favorite);
    } catch (error) {
      logger.error(`Favori detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Favori detayı alınamadı" });
    }
  }

  // Favori sil
  async deleteFavorite(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const favorite = await Favorite.findOne({
        where: { id, client_id },
      });

      if (!favorite) {
        return res.status(404).json({ error: "Favori bulunamadı" });
      }

      await favorite.update({
        active: false,
        status: "deleted",
        updated_by: client_id,
      });

      logger.info(`Favori silindi: ${id}`);
      res.json({ message: "Favori başarıyla silindi" });
    } catch (error) {
      logger.error(`Favori silme hatası: ${error.message}`);
      res.status(500).json({ error: "Favori silinemedi" });
    }
  }

  // Favori durumunu kontrol et
  async checkFavoriteStatus(req, res) {
    try {
      const client_id = req.user.id;
      const { type, id } = req.params;

      const favorite = await Favorite.findOne({
        where: {
          client_id,
          [`${type}_id`]: id,
          type,
          active: true,
          status: "active",
        },
      });

      res.json({
        isFavorite: !!favorite,
        favorite_id: favorite ? favorite.id : null,
      });
    } catch (error) {
      logger.error(`Favori durumu kontrol hatası: ${error.message}`);
      res.status(500).json({ error: "Favori durumu kontrol edilemedi" });
    }
  }
}

module.exports = new FavoriteController();

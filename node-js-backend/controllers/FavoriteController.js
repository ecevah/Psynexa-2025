const {
  Favorite,
  Meditation,
  Series,
  SeriesContent,
  BreathingExercise,
  IterationMeditation,
} = require("../models");
const logger = require("../config/logger");

class FavoriteController {
  // Yeni favori oluştur
  async createFavorite(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar favori ekleyebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar favori ekleyebilir",
        });
      }

      const {
        series_id,
        content_id,
        meditation_id,
        breathing_exercise_id,
        meditation_iteration_id,
        type,
      } = req.body;

      // Tip kontrolü
      if (
        !["series", "content", "meditation", "breathing", "iteration"].includes(
          type
        )
      ) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz favori tipi",
        });
      }

      // ID kontrolü
      const idMap = {
        series: series_id,
        content: content_id,
        meditation: meditation_id,
        breathing: breathing_exercise_id,
        iteration: meditation_iteration_id,
      };

      if (!idMap[type]) {
        return res.status(400).json({
          status: false,
          message: `${type}_id alanı zorunludur`,
        });
      }

      // Favori zaten var mı kontrol et
      const existingFavorite = await Favorite.findOne({
        where: {
          client_id: user.id,
          [`${type === "breathing" ? "breathing_exercise" : type}_id`]:
            idMap[type],
          type,
          active: true,
          status: "active",
        },
      });

      if (existingFavorite) {
        return res.status(400).json({
          status: false,
          message: "Bu içerik zaten favorilerde",
        });
      }

      // İlgili içeriğin var olduğunu kontrol et
      const modelMap = {
        series: Series,
        content: SeriesContent,
        meditation: Meditation,
        breathing: BreathingExercise,
        iteration: IterationMeditation,
      };

      const content = await modelMap[type].findByPk(idMap[type]);
      if (!content) {
        return res.status(404).json({
          status: false,
          message: "Favoriye eklenmek istenen içerik bulunamadı",
        });
      }

      const favorite = await Favorite.create({
        client_id: user.id,
        [`${type === "breathing" ? "breathing_exercise" : type}_id`]:
          idMap[type],
        type,
        created_by: user.id,
      });

      logger.info(`Yeni favori oluşturuldu: ${favorite.id}`);
      res.status(201).json({
        status: true,
        message: "Favori başarıyla eklendi",
        data: favorite,
      });
    } catch (error) {
      logger.error(`Favori oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Favori oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Danışanın favorilerini getir
  async getFavorites(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar favorilerini görebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar favorilerini görebilir",
        });
      }

      const { type } = req.query;

      const whereClause = {
        client_id: user.id,
        active: true,
        status: "active",
      };

      if (type) {
        if (
          ![
            "series",
            "content",
            "meditation",
            "breathing",
            "iteration",
          ].includes(type)
        ) {
          return res.status(400).json({
            status: false,
            message: "Geçersiz favori tipi",
          });
        }
        whereClause.type = type;
      }

      const includes = [
        {
          model: Series,
          as: "series",
          required: false,
        },
        {
          model: SeriesContent,
          as: "content",
          required: false,
        },
        {
          model: Meditation,
          as: "meditation",
          required: false,
        },
        {
          model: BreathingExercise,
          as: "breathingExercise",
          required: false,
        },
        {
          model: IterationMeditation,
          as: "meditationIteration",
          required: false,
        },
      ];

      const favorites = await Favorite.findAll({
        where: whereClause,
        include: includes,
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Favoriler başarıyla getirildi",
        data: favorites,
      });
    } catch (error) {
      logger.error(`Favori listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Favoriler alınamadı",
        error: error.message,
      });
    }
  }

  // Favori detayı
  async getFavorite(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar favori detayını görebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar favori detayını görebilir",
        });
      }

      const favorite = await Favorite.findOne({
        where: {
          id,
          client_id: user.id,
          active: true,
          status: "active",
        },
        include: [
          {
            model: Series,
            as: "series",
            required: false,
          },
          {
            model: SeriesContent,
            as: "content",
            required: false,
          },
          {
            model: Meditation,
            as: "meditation",
            required: false,
          },
          {
            model: BreathingExercise,
            as: "breathingExercise",
            required: false,
          },
          {
            model: IterationMeditation,
            as: "meditationIteration",
            required: false,
          },
        ],
      });

      if (!favorite) {
        return res.status(404).json({
          status: false,
          message: "Favori bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Favori detayı başarıyla getirildi",
        data: favorite,
      });
    } catch (error) {
      logger.error(`Favori detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Favori detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Favori sil
  async deleteFavorite(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      // Sadece danışanlar favori silebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar favori silebilir",
        });
      }

      const favorite = await Favorite.findOne({
        where: {
          id,
          client_id: user.id,
          active: true,
          status: "active",
        },
      });

      if (!favorite) {
        return res.status(404).json({
          status: false,
          message: "Favori bulunamadı",
        });
      }

      await favorite.update({
        active: false,
        status: "deleted",
        updated_by: user.id,
      });

      logger.info(`Favori silindi: ${id}`);
      res.json({
        status: true,
        message: "Favori başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Favori silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Favori silinemedi",
        error: error.message,
      });
    }
  }

  // Favori durumunu kontrol et
  async checkFavoriteStatus(req, res) {
    try {
      const user = req.user;

      // Sadece danışanlar favori durumunu kontrol edebilir
      if (user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar favori durumunu kontrol edebilir",
        });
      }

      const { type, id } = req.params;

      if (
        !["series", "content", "meditation", "breathing", "iteration"].includes(
          type
        )
      ) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz favori tipi",
        });
      }

      const favorite = await Favorite.findOne({
        where: {
          client_id: user.id,
          [`${type === "breathing" ? "breathing_exercise" : type}_id`]: id,
          type,
          active: true,
          status: "active",
        },
      });

      res.json({
        status: true,
        message: "Favori durumu başarıyla kontrol edildi",
        data: {
          isFavorite: !!favorite,
          favorite_id: favorite ? favorite.id : null,
        },
      });
    } catch (error) {
      logger.error(`Favori durumu kontrol hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Favori durumu kontrol edilemedi",
        error: error.message,
      });
    }
  }
}

module.exports = new FavoriteController();

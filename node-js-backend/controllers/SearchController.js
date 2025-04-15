const {
  Blog,
  Meditation,
  IterativeMeditation,
  BreathingExercise,
} = require("../models");
const { Op } = require("sequelize");
const logger = require("../config/logger");

class SearchController {
  // Başlığa göre arama - tüm içerik türlerinde tek bir sorgu ile arama yapar
  async searchByTitle(req, res) {
    try {
      const { keyword } = req.params;

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Arama kelimesi gereklidir",
        });
      }

      // Eş zamanlı olarak farklı içerik türlerinde arama
      const [blogs, meditations, iterativeMeditations, breathingExercises] =
        await Promise.all([
          // Blog yazılarında arama
          Blog.findAll({
            where: {
              title: {
                [Op.like]: `%${keyword}%`,
              },
              is_active: true,
            },
            attributes: [
              "id",
              "title",
              "slug",
              "cover_image",
              "created_at",
              "category",
            ],
          }),

          // Meditasyonlarda arama
          Meditation.findAll({
            where: {
              title: {
                [Op.like]: `%${keyword}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),

          // İterasyonlu meditasyonlarda arama
          IterativeMeditation.findAll({
            where: {
              title: {
                [Op.like]: `%${keyword}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),

          // Nefes egzersizlerinde arama
          BreathingExercise.findAll({
            where: {
              title: {
                [Op.like]: `%${keyword}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),
        ]);

      logger.info(`Başlık araması yapıldı: ${keyword}`);

      return res.json({
        status: true,
        message: "Arama sonuçları",
        data: {
          blogs,
          meditations,
          iterativeMeditations,
          breathingExercises,
          counts: {
            blogs: blogs.length,
            meditations: meditations.length,
            iterativeMeditations: iterativeMeditations.length,
            breathingExercises: breathingExercises.length,
            total:
              blogs.length +
              meditations.length +
              iterativeMeditations.length +
              breathingExercises.length,
          },
        },
      });
    } catch (error) {
      logger.error(`Başlık araması hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Arama sırasında bir hata oluştu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Kategoriye göre arama - tüm içerik türlerinde tek bir sorgu ile kategori bazlı arama yapar
  async searchByCategory(req, res) {
    try {
      const { category } = req.params;

      if (!category || category.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Kategori bilgisi gereklidir",
        });
      }

      // Eş zamanlı olarak farklı içerik türlerinde kategori araması
      const [blogs, meditations, iterativeMeditations, breathingExercises] =
        await Promise.all([
          // Blog yazılarında arama
          Blog.findAll({
            where: {
              category: {
                [Op.like]: `%${category}%`,
              },
              is_active: true,
            },
            attributes: [
              "id",
              "title",
              "slug",
              "cover_image",
              "created_at",
              "category",
            ],
          }),

          // Meditasyonlarda arama
          Meditation.findAll({
            where: {
              category: {
                [Op.like]: `%${category}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),

          // İterasyonlu meditasyonlarda arama
          IterativeMeditation.findAll({
            where: {
              category: {
                [Op.like]: `%${category}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),

          // Nefes egzersizlerinde arama
          BreathingExercise.findAll({
            where: {
              category: {
                [Op.like]: `%${category}%`,
              },
              is_active: true,
            },
            attributes: ["id", "title", "cover_image", "duration", "category"],
          }),
        ]);

      logger.info(`Kategori araması yapıldı: ${category}`);

      return res.json({
        status: true,
        message: "Kategori arama sonuçları",
        data: {
          blogs,
          meditations,
          iterativeMeditations,
          breathingExercises,
          counts: {
            blogs: blogs.length,
            meditations: meditations.length,
            iterativeMeditations: iterativeMeditations.length,
            breathingExercises: breathingExercises.length,
            total:
              blogs.length +
              meditations.length +
              iterativeMeditations.length +
              breathingExercises.length,
          },
        },
      });
    } catch (error) {
      logger.error(`Kategori araması hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Kategori araması sırasında bir hata oluştu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new SearchController();

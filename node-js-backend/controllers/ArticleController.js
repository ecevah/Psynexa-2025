const { Article, Psychologist } = require("../models");
const logger = require("../config/logger");

class ArticleController {
  // Yeni makale oluştur
  async createArticle(req, res) {
    try {
      const psyc_id = req.user.id;
      const { title, description, content, content_type, bibliography } =
        req.body;

      // Dosya URL'lerini hazırla
      const background_url = req.files["background_image"]
        ? `/uploads/${req.files["background_image"][0].filename}`
        : null;
      const vocalization_url = req.files["vocalization"]
        ? `/uploads/${req.files["vocalization"][0].filename}`
        : null;
      const sound_url = req.files["sound"]
        ? `/uploads/${req.files["sound"][0].filename}`
        : null;
      const content_url = req.files["video"]
        ? `/uploads/${req.files["video"][0].filename}`
        : null;

      const article = await Article.create({
        psyc_id,
        title,
        description,
        content,
        content_type,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
        created_by: psyc_id,
      });

      logger.info(`Yeni makale oluşturuldu: ${article.id}`);
      res
        .status(201)
        .json({ status: true, message: "Makale oluşturuldu", data: article });
    } catch (error) {
      logger.error(`Makale oluşturma hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Makale oluşturulamadı" });
    }
  }

  // Tüm makaleleri getir
  async getArticles(req, res) {
    try {
      const articles = await Article.findAll({
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      logger.info(`${articles.length} makale listelendi`);
      res
        .status(200)
        .json({ status: true, message: "Makaleler alındı", data: articles });
    } catch (error) {
      logger.error(`Makale listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Makaleler alınamadı" });
    }
  }

  // Psikoloğun makalelerini getir
  async getPsychologistArticles(req, res) {
    try {
      const psyc_id = req.user.id;
      const articles = await Article.findAll({
        where: { psyc_id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res
        .status(200)
        .json({ status: true, message: "Makaleler alındı", data: articles });
    } catch (error) {
      logger.error(`Makale listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Makaleler alınamadı" });
    }
  }

  // Makale detayı
  async getArticle(req, res) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!article) {
        return res
          .status(404)
          .json({ status: false, message: "Makale bulunamadı" });
      }

      res
        .status(200)
        .json({ status: true, message: "Makale detayı alındı", data: article });
    } catch (error) {
      logger.error(`Makale detayı hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Makale detayı alınamadı" });
    }
  }

  // Makale güncelle
  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const {
        title,
        description,
        content,
        content_type,
        status,
        bibliography,
      } = req.body;

      const article = await Article.findOne({
        where: { id, psyc_id },
      });

      if (!article) {
        return res
          .status(404)
          .json({ status: false, message: "Makale bulunamadı" });
      }

      // Dosya URL'lerini hazırla
      const background_url =
        req.files && req.files["background_image"]
          ? `/uploads/${req.files["background_image"][0].filename}`
          : article.background_url;
      const vocalization_url =
        req.files && req.files["vocalization"]
          ? `/uploads/${req.files["vocalization"][0].filename}`
          : article.vocalization_url;
      const sound_url =
        req.files && req.files["sound"]
          ? `/uploads/${req.files["sound"][0].filename}`
          : article.sound_url;
      const content_url =
        req.files && req.files["video"]
          ? `/uploads/${req.files["video"][0].filename}`
          : article.content_url;

      if (status === "published" && article.status !== "published") {
        req.body.published_at = new Date();
      }

      if (status === "draft" && article.status !== "draft") {
        req.body.draft_update_date = new Date();
      }

      await article.update({
        title,
        description,
        content,
        content_type,
        status,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
        updated_by: psyc_id,
      });

      logger.info(`Makale güncellendi: ${id}`);
      res
        .status(200)
        .json({ status: true, message: "Makale güncellendi", data: article });
    } catch (error) {
      logger.error(`Makale güncelleme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Makale güncellenemedi" });
    }
  }

  // Makale sil
  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const article = await Article.findOne({
        where: { id, psyc_id },
      });

      if (!article) {
        return res
          .status(404)
          .json({ status: false, message: "Makale bulunamadı" });
      }

      await article.update({
        status: "archived",
        updated_by: psyc_id,
      });

      logger.info(`Makale arşivlendi: ${id}`);
      res
        .status(200)
        .json({ status: true, message: "Makale başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Makale silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Makale silinemedi" });
    }
  }
}

module.exports = new ArticleController();

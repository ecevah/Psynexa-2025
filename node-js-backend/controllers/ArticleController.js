const { Article, Psychologist } = require("../models");
const logger = require("../config/logger");

class ArticleController {
  // Yeni makale oluştur
  async createArticle(req, res) {
    try {
      const psyc_id = req.user.id;
      const {
        title,
        description,
        content,
        content_type,
        bibliography,
        background_url,
        vocalization_url,
        sound_url,
        content_url,
      } = req.body;

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
      res.status(201).json(article);
    } catch (error) {
      logger.error(`Makale oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Makale oluşturulamadı" });
    }
  }

  // Tüm makaleleri getir
  async getArticles(req, res) {
    try {
      const articles = await Article.findAll({
        where: { status: "published" },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
        ],
        order: [["published_at", "DESC"]],
      });

      res.json(articles);
    } catch (error) {
      logger.error(`Makale listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Makaleler alınamadı" });
    }
  }

  // Psikoloğun makalelerini getir
  async getPsychologistArticles(req, res) {
    try {
      const psyc_id = req.user.id;
      const articles = await Article.findAll({
        where: { psyc_id },
        order: [["created_at", "DESC"]],
      });

      res.json(articles);
    } catch (error) {
      logger.error(`Makale listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Makaleler alınamadı" });
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
            attributes: ["id", "name"],
          },
        ],
      });

      if (!article) {
        return res.status(404).json({ error: "Makale bulunamadı" });
      }

      res.json(article);
    } catch (error) {
      logger.error(`Makale detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Makale detayı alınamadı" });
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
        background_url,
        vocalization_url,
        sound_url,
        content_url,
      } = req.body;

      const article = await Article.findOne({
        where: { id, psyc_id },
      });

      if (!article) {
        return res.status(404).json({ error: "Makale bulunamadı" });
      }

      if (status === "published" && article.status !== "published") {
        req.body.published_at = new Date();
      }

      if (status === "draft" && article.status !== "draft") {
        req.body.draft_update_date = new Date();
      }

      await article.update({
        ...req.body,
        updated_by: psyc_id,
      });

      logger.info(`Makale güncellendi: ${id}`);
      res.json(article);
    } catch (error) {
      logger.error(`Makale güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Makale güncellenemedi" });
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
        return res.status(404).json({ error: "Makale bulunamadı" });
      }

      await article.update({
        status: "archived",
        updated_by: psyc_id,
      });

      logger.info(`Makale arşivlendi: ${id}`);
      res.json({ message: "Makale başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Makale silme hatası: ${error.message}`);
      res.status(500).json({ error: "Makale silinemedi" });
    }
  }
}

module.exports = new ArticleController();

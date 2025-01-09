const { Blog, Psychologist } = require("../models");
const logger = require("../config/logger");

class BlogController {
  // Yeni blog oluştur
  async createBlog(req, res) {
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

      const blog = await Blog.create({
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

      logger.info(`Yeni blog oluşturuldu: ${blog.id}`);
      res.status(201).json(blog);
    } catch (error) {
      logger.error(`Blog oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Blog oluşturulamadı" });
    }
  }

  // Tüm blogları getir
  async getBlogs(req, res) {
    try {
      const blogs = await Blog.findAll({
        where: { status: "published" },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
        ],
        order: [["published_at", "DESC"]],
      });

      res.json(blogs);
    } catch (error) {
      logger.error(`Blog listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Bloglar alınamadı" });
    }
  }

  // Psikoloğun bloglarını getir
  async getPsychologistBlogs(req, res) {
    try {
      const psyc_id = req.user.id;
      const blogs = await Blog.findAll({
        where: { psyc_id },
        order: [["created_at", "DESC"]],
      });

      res.json(blogs);
    } catch (error) {
      logger.error(`Blog listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Bloglar alınamadı" });
    }
  }

  // Blog detayı
  async getBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = await Blog.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog bulunamadı" });
      }

      res.json(blog);
    } catch (error) {
      logger.error(`Blog detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Blog detayı alınamadı" });
    }
  }

  // Blog güncelle
  async updateBlog(req, res) {
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

      const blog = await Blog.findOne({
        where: { id, psyc_id },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog bulunamadı" });
      }

      if (status === "published" && blog.status !== "published") {
        req.body.published_at = new Date();
      }

      if (status === "draft" && blog.status !== "draft") {
        req.body.draft_update_date = new Date();
      }

      await blog.update({
        ...req.body,
        updated_by: psyc_id,
      });

      logger.info(`Blog güncellendi: ${id}`);
      res.json(blog);
    } catch (error) {
      logger.error(`Blog güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Blog güncellenemedi" });
    }
  }

  // Blog sil
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const blog = await Blog.findOne({
        where: { id, psyc_id },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog bulunamadı" });
      }

      await blog.update({
        status: "archived",
        updated_by: psyc_id,
      });

      logger.info(`Blog arşivlendi: ${id}`);
      res.json({ message: "Blog başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Blog silme hatası: ${error.message}`);
      res.status(500).json({ error: "Blog silinemedi" });
    }
  }
}

module.exports = new BlogController();

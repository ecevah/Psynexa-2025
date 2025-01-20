const { Blog, Psychologist } = require("../models");
const logger = require("../config/logger");

class BlogController {
  // Yeni blog oluştur
  async createBlog(req, res) {
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
      res
        .status(201)
        .json({ status: true, message: "Blog oluşturuldu", data: blog });
    } catch (error) {
      logger.error(`Blog oluşturma hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Blog oluşturulamadı" });
    }
  }

  // Tüm blogları getir
  async getBlogs(req, res) {
    try {
      const blogs = await Blog.findAll({
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      logger.info(`${blogs.length} blog listelendi`);
      res
        .status(200)
        .json({ status: true, message: "Bloglar alındı", data: blogs });
    } catch (error) {
      logger.error(`Blog listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Bloglar alınamadı" });
    }
  }

  // Psikoloğun bloglarını getir
  async getPsychologistBlogs(req, res) {
    try {
      const psyc_id = req.user.id;
      const blogs = await Blog.findAll({
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
        .json({ status: true, message: "Bloglar alındı", data: blogs });
    } catch (error) {
      logger.error(`Blog listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Bloglar alınamadı" });
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
            as: "psychologist",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!blog) {
        return res
          .status(404)
          .json({ status: false, message: "Blog bulunamadı" });
      }

      res
        .status(200)
        .json({ status: true, message: "Blog detayı alındı", data: blog });
    } catch (error) {
      logger.error(`Blog detayı hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Blog detayı alınamadı" });
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
        return res
          .status(404)
          .json({ status: false, message: "Blog bulunamadı" });
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
      res
        .status(200)
        .json({ status: true, message: "Blog güncellendi", data: blog });
    } catch (error) {
      logger.error(`Blog güncelleme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Blog güncellenemedi" });
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
        return res
          .status(404)
          .json({ status: false, message: "Blog bulunamadı" });
      }

      await blog.update({
        status: "archived",
        updated_by: psyc_id,
      });

      logger.info(`Blog arşivlendi: ${id}`);
      res
        .status(200)
        .json({ status: true, message: "Blog başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Blog silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Blog silinemedi" });
    }
  }
}

module.exports = new BlogController();

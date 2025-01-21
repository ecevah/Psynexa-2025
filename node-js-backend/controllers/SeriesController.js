const { Series, SeriesContent, Client } = require("../models");
const logger = require("../config/logger");

class SeriesController {
  // Yeni seri oluştur
  async createSeries(req, res) {
    try {
      const client_id = req.user.id;
      const { title, description, contents } = req.body;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seri oluşturabilir",
        });
      }

      const series = await Series.create({
        client_id,
        title,
        description,
        status: "active",
        created_by: client_id,
      });

      if (contents && contents.length > 0) {
        const contentsToCreate = contents.map((content, index) => ({
          series_id: series.id,
          meditation_iteration_id: content.meditation_iteration_id,
          meditation_id: content.meditation_id,
          blog_id: content.blog_id,
          article_id: content.article_id,
          breathing_exercise_id: content.breathing_exercise_id,
          title: content.title || "İçerik " + (index + 1),
          description: content.description,
          order: content.order || index + 1,
          created_by: client_id,
        }));

        await SeriesContent.bulkCreate(contentsToCreate);
      }

      logger.info(`Yeni seri oluşturuldu: ${series.id}`);
      res.status(201).json({
        status: true,
        message: "Seri başarıyla oluşturuldu",
        data: series,
      });
    } catch (error) {
      logger.error(`Seri oluşturma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Seri oluşturulamadı",
        error: error.message,
      });
    }
  }

  // Danışanın serilerini getir
  async getClientSeries(req, res) {
    try {
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar serilerini görebilir",
        });
      }

      const series = await Series.findAll({
        where: {
          client_id,
          status: "active",
        },
        include: [
          {
            model: SeriesContent,
            as: "contents",
            where: { status: true },
            required: false,
          },
        ],
        order: [
          ["created_at", "DESC"],
          [{ model: SeriesContent, as: "contents" }, "order", "ASC"],
        ],
      });

      res.json({
        status: true,
        message: "Seriler başarıyla getirildi",
        data: series,
      });
    } catch (error) {
      logger.error(`Seri listesi hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Seriler alınamadı",
        error: error.message,
      });
    }
  }

  // Seri detayı
  async getSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seri detayını görebilir",
        });
      }

      const series = await Series.findOne({
        where: {
          id,
          client_id,
          status: "active",
        },
        include: [
          {
            model: SeriesContent,
            as: "contents",
            where: { status: true },
            required: false,
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!series) {
        return res.status(404).json({
          status: false,
          message: "Seri bulunamadı",
        });
      }

      res.json({
        status: true,
        message: "Seri detayı başarıyla getirildi",
        data: series,
      });
    } catch (error) {
      logger.error(`Seri detayı hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Seri detayı alınamadı",
        error: error.message,
      });
    }
  }

  // Seri güncelle
  async updateSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const { title, description, status, contents } = req.body;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seri güncelleyebilir",
        });
      }

      const series = await Series.findOne({
        where: {
          id,
          client_id,
          status: "active",
        },
      });

      if (!series) {
        return res.status(404).json({
          status: false,
          message: "Seri bulunamadı",
        });
      }

      await series.update({
        title,
        description,
        status,
        updated_by: client_id,
      });

      if (contents && contents.length > 0) {
        // Mevcut içerikleri pasife çek
        await SeriesContent.update(
          { status: false },
          { where: { series_id: id } }
        );

        // Yeni içerikleri ekle
        const contentsToCreate = contents.map((content, index) => ({
          series_id: id,
          meditation_iteration_id: content.meditation_iteration_id,
          meditation_id: content.meditation_id,
          blog_id: content.blog_id,
          article_id: content.article_id,
          breathing_exercise_id: content.breathing_exercise_id,
          title: content.title || "İçerik " + (index + 1),
          description: content.description,
          order: content.order || index + 1,
          created_by: client_id,
        }));

        await SeriesContent.bulkCreate(contentsToCreate);
      }

      logger.info(`Seri güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Seri başarıyla güncellendi",
        data: series,
      });
    } catch (error) {
      logger.error(`Seri güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Seri güncellenemedi",
        error: error.message,
      });
    }
  }

  // Seri sil
  async deleteSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seri silebilir",
        });
      }

      const series = await Series.findOne({
        where: {
          id,
          client_id,
          status: "active",
        },
      });

      if (!series) {
        return res.status(404).json({
          status: false,
          message: "Seri bulunamadı",
        });
      }

      // Soft delete - status'u archived yap
      await series.update({
        status: "archived",
        updated_by: client_id,
      });

      // İlişkili içerikleri pasife çek
      await SeriesContent.update(
        { status: false },
        { where: { series_id: id } }
      );

      logger.info(`Seri arşivlendi: ${id}`);
      res.json({
        status: true,
        message: "Seri başarıyla arşivlendi",
      });
    } catch (error) {
      logger.error(`Seri silme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Seri arşivlenemedi",
        error: error.message,
      });
    }
  }

  // Seriye içerik ekle
  async addContent(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const content = req.body;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seriye içerik ekleyebilir",
        });
      }

      const series = await Series.findOne({
        where: {
          id,
          client_id,
          status: "active",
        },
      });

      if (!series) {
        return res.status(404).json({
          status: false,
          message: "Seri bulunamadı",
        });
      }

      // Son order numarasını bul
      const lastContent = await SeriesContent.findOne({
        where: { series_id: id, status: true },
        order: [["order", "DESC"]],
      });

      const newContent = await SeriesContent.create({
        series_id: id,
        meditation_iteration_id: content.meditation_iteration_id,
        meditation_id: content.meditation_id,
        blog_id: content.blog_id,
        article_id: content.article_id,
        breathing_exercise_id: content.breathing_exercise_id,
        title: content.title || "Yeni İçerik",
        description: content.description,
        order: lastContent ? lastContent.order + 1 : 1,
        created_by: client_id,
      });

      logger.info(`Seriye içerik eklendi: ${newContent.id}`);
      res.status(201).json({
        status: true,
        message: "İçerik başarıyla eklendi",
        data: newContent,
      });
    } catch (error) {
      logger.error(`Seriye içerik ekleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "İçerik eklenemedi",
        error: error.message,
      });
    }
  }

  // Seriden içerik kaldır
  async removeContent(req, res) {
    try {
      const { id, content_id } = req.params;
      const client_id = req.user.id;

      // Kullanıcı tipi kontrolü
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Sadece danışanlar seriden içerik kaldırabilir",
        });
      }

      const series = await Series.findOne({
        where: {
          id,
          client_id,
          status: "active",
        },
      });

      if (!series) {
        return res.status(404).json({
          status: false,
          message: "Seri bulunamadı",
        });
      }

      const content = await SeriesContent.findOne({
        where: {
          id: content_id,
          series_id: id,
          status: true,
        },
      });

      if (!content) {
        return res.status(404).json({
          status: false,
          message: "İçerik bulunamadı",
        });
      }

      // Soft delete - status'u false yap
      await content.update({
        status: false,
        updated_by: client_id,
      });

      logger.info(`Seriden içerik kaldırıldı: ${content_id}`);
      res.json({
        status: true,
        message: "İçerik başarıyla kaldırıldı",
      });
    } catch (error) {
      logger.error(`Seriden içerik kaldırma hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "İçerik kaldırılamadı",
        error: error.message,
      });
    }
  }
}

module.exports = new SeriesController();

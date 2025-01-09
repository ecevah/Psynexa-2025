const { Series, SeriesContent, Client } = require("../models");
const logger = require("../config/logger");

class SeriesController {
  // Yeni seri oluştur
  async createSeries(req, res) {
    try {
      const client_id = req.user.id;
      const { name, type, contents } = req.body;

      const series = await Series.create({
        client_id,
        name,
        type,
        created_by: client_id,
      });

      if (contents && contents.length > 0) {
        const contentsToCreate = contents.map((content) => ({
          ...content,
          series_id: series.id,
          created_by: client_id,
        }));

        await SeriesContent.bulkCreate(contentsToCreate);
      }

      logger.info(`Yeni seri oluşturuldu: ${series.id}`);
      res.status(201).json(series);
    } catch (error) {
      logger.error(`Seri oluşturma hatası: ${error.message}`);
      res.status(500).json({ error: "Seri oluşturulamadı" });
    }
  }

  // Danışanın serilerini getir
  async getClientSeries(req, res) {
    try {
      const client_id = req.user.id;
      const series = await Series.findAll({
        where: { client_id, status: "active" },
        include: [
          {
            model: SeriesContent,
            attributes: [
              "id",
              "iterations_mediation_id",
              "mediation_id",
              "blog_id",
              "article_id",
              "breathing_exercises_id",
              "type",
              "status",
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(series);
    } catch (error) {
      logger.error(`Seri listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Seriler alınamadı" });
    }
  }

  // Seri detayı
  async getSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const series = await Series.findOne({
        where: { id, client_id },
        include: [
          {
            model: SeriesContent,
            attributes: [
              "id",
              "iterations_mediation_id",
              "mediation_id",
              "blog_id",
              "article_id",
              "breathing_exercises_id",
              "type",
              "status",
            ],
          },
        ],
      });

      if (!series) {
        return res.status(404).json({ error: "Seri bulunamadı" });
      }

      res.json(series);
    } catch (error) {
      logger.error(`Seri detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Seri detayı alınamadı" });
    }
  }

  // Seri güncelle
  async updateSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const { name, type, status, contents } = req.body;

      const series = await Series.findOne({
        where: { id, client_id },
      });

      if (!series) {
        return res.status(404).json({ error: "Seri bulunamadı" });
      }

      await series.update({
        name,
        type,
        status,
        updated_by: client_id,
      });

      if (contents && contents.length > 0) {
        // Mevcut içerikleri sil
        await SeriesContent.destroy({
          where: { series_id: id },
        });

        // Yeni içerikleri ekle
        const contentsToCreate = contents.map((content) => ({
          ...content,
          series_id: id,
          created_by: client_id,
        }));

        await SeriesContent.bulkCreate(contentsToCreate);
      }

      logger.info(`Seri güncellendi: ${id}`);
      res.json(series);
    } catch (error) {
      logger.error(`Seri güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Seri güncellenemedi" });
    }
  }

  // Seri sil
  async deleteSeries(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;

      const series = await Series.findOne({
        where: { id, client_id },
      });

      if (!series) {
        return res.status(404).json({ error: "Seri bulunamadı" });
      }

      // İlişkili içerikleri sil
      await SeriesContent.destroy({
        where: { series_id: id },
      });

      // Seriyi sil
      await series.destroy();

      logger.info(`Seri silindi: ${id}`);
      res.json({ message: "Seri başarıyla silindi" });
    } catch (error) {
      logger.error(`Seri silme hatası: ${error.message}`);
      res.status(500).json({ error: "Seri silinemedi" });
    }
  }

  // Seriye içerik ekle
  async addContent(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const content = req.body;

      const series = await Series.findOne({
        where: { id, client_id },
      });

      if (!series) {
        return res.status(404).json({ error: "Seri bulunamadı" });
      }

      const newContent = await SeriesContent.create({
        ...content,
        series_id: id,
        created_by: client_id,
      });

      logger.info(`Seriye içerik eklendi: ${newContent.id}`);
      res.status(201).json(newContent);
    } catch (error) {
      logger.error(`Seriye içerik ekleme hatası: ${error.message}`);
      res.status(500).json({ error: "İçerik eklenemedi" });
    }
  }

  // Seriden içerik kaldır
  async removeContent(req, res) {
    try {
      const { id, content_id } = req.params;
      const client_id = req.user.id;

      const series = await Series.findOne({
        where: { id, client_id },
      });

      if (!series) {
        return res.status(404).json({ error: "Seri bulunamadı" });
      }

      const content = await SeriesContent.findOne({
        where: { id: content_id, series_id: id },
      });

      if (!content) {
        return res.status(404).json({ error: "İçerik bulunamadı" });
      }

      await content.destroy();

      logger.info(`Seriden içerik kaldırıldı: ${content_id}`);
      res.json({ message: "İçerik başarıyla kaldırıldı" });
    } catch (error) {
      logger.error(`Seriden içerik kaldırma hatası: ${error.message}`);
      res.status(500).json({ error: "İçerik kaldırılamadı" });
    }
  }
}

module.exports = new SeriesController();

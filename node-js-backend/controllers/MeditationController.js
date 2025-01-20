const { Meditation, Psychologist } = require("../models");
const logger = require("../config/logger");
const { deleteFile } = require("../config/multer");

class MeditationController {
  // Yeni meditasyon oluştur
  async createMeditation(req, res) {
    try {
      const psyc_id = req.user.id;
      const { title, description, duration, content } = req.body;

      // Dosya yollarını al
      const background_url = req.files?.background_image?.[0]?.path?.replace(
        "public/",
        ""
      );
      const vocalization_url = req.files?.vocalization?.[0]?.path?.replace(
        "public/",
        ""
      );
      const sound_url = req.files?.sound?.[0]?.path?.replace("public/", "");
      const video_url = req.files?.video?.[0]?.path?.replace("public/", "");

      if (!content) {
        return res.status(400).json({
          status: false,
          message: "Meditasyon içeriği zorunludur",
        });
      }

      const meditation = await Meditation.create({
        psyc_id,
        title,
        description,
        duration: parseInt(duration),
        content,
        background_url,
        vocalization_url,
        sound_url,
        content_url: video_url,
        created_by: psyc_id,
      });

      logger.info(`Yeni meditasyon oluşturuldu: ${meditation.id}`);
      res.status(201).json({
        status: true,
        message: "Meditasyon oluşturuldu",
        data: meditation,
      });
    } catch (error) {
      // Hata durumunda yüklenen dosyaları sil
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => {
            deleteFile(file.path);
          });
        });
      }

      logger.error(`Meditasyon oluşturma hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon oluşturulamadı" });
    }
  }

  // Tüm meditasyonları getir
  async getMeditations(req, res) {
    try {
      const meditations = await Meditation.findAll({
        where: { status: "active" },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Meditasyonlar başarıyla getirildi",
        data: meditations,
      });
    } catch (error) {
      logger.error(`Meditasyon listesi hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyonlar alınamadı" });
    }
  }

  // Psikoloğun meditasyonlarını getir
  async getPsychologistMeditations(req, res) {
    try {
      const psyc_id = req.user.id;
      const meditations = await Meditation.findAll({
        where: { psyc_id, status: "active" },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        status: true,
        message: "Meditasyonlar başarıyla getirildi",
        data: meditations,
      });
    } catch (error) {
      logger.error(`Meditasyon listesi hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyonlar alınamadı" });
    }
  }

  // Meditasyon detayı
  async getMeditation(req, res) {
    try {
      const { id } = req.params;

      if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz meditasyon ID'si",
        });
      }

      const meditation = await Meditation.findOne({
        where: { id },
        include: [
          {
            model: Psychologist,
            as: "psychologist",
            attributes: ["id", "name", "surname"],
          },
        ],
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      res.json({
        status: true,
        message: "Meditasyon başarıyla getirildi",
        data: meditation,
      });
    } catch (error) {
      logger.error(`Meditasyon detayı hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon detayı alınamadı" });
    }
  }

  // Meditasyon güncelle
  async updateMeditation(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const { title, description, duration, content, status } = req.body;

      if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz meditasyon ID'si",
        });
      }

      const meditation = await Meditation.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      // Eski dosyaları sakla
      const oldFiles = {
        background_url: meditation.background_url
          ? "public/" + meditation.background_url
          : null,
        vocalization_url: meditation.vocalization_url
          ? "public/" + meditation.vocalization_url
          : null,
        sound_url: meditation.sound_url
          ? "public/" + meditation.sound_url
          : null,
        content_url: meditation.content_url
          ? "public/" + meditation.content_url
          : null,
      };

      // Yeni dosya yollarını al
      const updateData = {
        title,
        description,
        duration: duration ? parseInt(duration) : undefined,
        content,
        status,
        updated_by: psyc_id,
      };

      if (req.files?.background_image?.[0]) {
        updateData.background_url = req.files.background_image[0].path.replace(
          "public/",
          ""
        );
      }
      if (req.files?.vocalization?.[0]) {
        updateData.vocalization_url = req.files.vocalization[0].path.replace(
          "public/",
          ""
        );
      }
      if (req.files?.sound?.[0]) {
        updateData.sound_url = req.files.sound[0].path.replace("public/", "");
      }
      if (req.files?.video?.[0]) {
        updateData.content_url = req.files.video[0].path.replace("public/", "");
      }

      await meditation.update(updateData);

      // Eski dosyaları sil
      Object.entries(oldFiles).forEach(([key, value]) => {
        if (updateData[key] && value) {
          deleteFile(value);
        }
      });

      logger.info(`Meditasyon güncellendi: ${id}`);
      res.json({
        status: true,
        message: "Meditasyon başarıyla güncellendi",
        data: meditation,
      });
    } catch (error) {
      // Hata durumunda yüklenen yeni dosyaları sil
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => {
            deleteFile(file.path);
          });
        });
      }

      logger.error(`Meditasyon güncelleme hatası: ${error.message}`);
      res
        .status(500)
        .json({ status: false, message: "Meditasyon güncellenemedi" });
    }
  }

  // Meditasyon sil
  async deleteMeditation(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz meditasyon ID'si",
        });
      }

      const meditation = await Meditation.findOne({
        where: { id, psyc_id },
      });

      if (!meditation) {
        return res
          .status(404)
          .json({ status: false, message: "Meditasyon bulunamadı" });
      }

      // Dosyaları sil
      if (meditation.background_url)
        deleteFile("public/" + meditation.background_url);
      if (meditation.vocalization_url)
        deleteFile("public/" + meditation.vocalization_url);
      if (meditation.sound_url) deleteFile("public/" + meditation.sound_url);
      if (meditation.content_url)
        deleteFile("public/" + meditation.content_url);

      await meditation.update({
        status: "inactive",
        updated_by: psyc_id,
      });

      logger.info(`Meditasyon arşivlendi: ${id}`);
      res.json({ status: true, message: "Meditasyon başarıyla arşivlendi" });
    } catch (error) {
      logger.error(`Meditasyon silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Meditasyon silinemedi" });
    }
  }
}

module.exports = new MeditationController();

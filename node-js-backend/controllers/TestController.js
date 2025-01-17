const { Test, Question } = require("../models");
const logger = require("../config/logger");
const { deleteFile } = require("../config/multer");
const path = require("path");

class TestController {
  // Test oluşturma
  async createTest(req, res) {
    try {
      const psychologist_id = req.user.id;

      if (req.file) {
        req.body.test_image = path.relative("public", req.file.path);
      }

      const test = await Test.create({
        ...req.body,
        created_by: psychologist_id,
        updated_by: psychologist_id,
      });

      if (req.file) {
        const oldPath = req.file.path;
        const newPath = oldPath.replace("temp", test.id.toString());
        const newDir = path.dirname(newPath);

        require("fs").mkdirSync(newDir, { recursive: true });
        require("fs").renameSync(oldPath, newPath);

        await test.update({
          test_image: path.relative("public", newPath),
        });
      }

      logger.info(`Yeni test oluşturuldu: ${test.id}`);
      res.status(201).json({ status: true, data: test });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      logger.error(`Test oluşturma hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Test oluşturulamadı" });
    }
  }

  // Test listesi
  async getTests(req, res) {
    try {
      const tests = await Test.findAll({
        include: [
          {
            model: Question,
            attributes: ["id", "questions", "type", "status", "queue"],
          },
        ],
        order: [
          ["created_at", "DESC"],
          [Question, "queue", "ASC"],
        ],
      });

      res.status(200).json({ status: true, data: tests });
    } catch (error) {
      logger.error(`Test listesi hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Testler alınamadı" });
    }
  }

  // Test detayı
  async getTest(req, res) {
    try {
      const { id } = req.params;

      const test = await Test.findOne({
        where: { id },
        include: [
          {
            model: Question,
            attributes: [
              "id",
              "questions",
              "options",
              "type",
              "status",
              "queue",
            ],
          },
        ],
        order: [[Question, "queue", "ASC"]],
      });

      if (!test) {
        return res
          .status(404)
          .json({ status: false, message: "Test bulunamadı" });
      }

      res.status(200).json({ status: true, data: test });
    } catch (error) {
      logger.error(`Test detayı hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Test detayı alınamadı" });
    }
  }

  // Test güncelleme
  async updateTest(req, res) {
    try {
      const { id } = req.params;
      const psychologist_id = req.user.id;

      const test = await Test.findByPk(id);

      if (!test) {
        if (req.file) deleteFile(req.file.path);
        return res
          .status(404)
          .json({ status: false, message: "Test bulunamadı" });
      }

      if (req.file) {
        // Eski resmi sil
        if (test.test_image) {
          deleteFile(path.join("public", test.test_image));
        }

        // Yeni resmi kaydet
        const oldPath = req.file.path;
        const newPath = oldPath.replace("temp", test.id.toString());
        const newDir = path.dirname(newPath);

        require("fs").mkdirSync(newDir, { recursive: true });
        require("fs").renameSync(oldPath, newPath);

        req.body.test_image = path.relative("public", newPath);
      }

      await test.update({
        ...req.body,
        updated_by: psychologist_id,
      });

      logger.info(`Test güncellendi: ${id}`);
      res.status(200).json({ status: true, data: test });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      logger.error(`Test güncelleme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Test güncellenemedi" });
    }
  }

  // Test silme
  async deleteTest(req, res) {
    try {
      const { id } = req.params;

      const test = await Test.findByPk(id);

      if (!test) {
        return res
          .status(404)
          .json({ status: false, message: "Test bulunamadı" });
      }

      // Test resmini sil
      if (test.test_image) {
        deleteFile(path.join("public", test.test_image));
      }

      await test.destroy();
      logger.info(`Test silindi: ${id}`);
      res.status(200).json({ status: true, message: "Test başarıyla silindi" });
    } catch (error) {
      logger.error(`Test silme hatası: ${error.message}`);
      res.status(500).json({ status: false, message: "Test silinemedi" });
    }
  }
}

module.exports = new TestController();

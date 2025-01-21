const AssignedTask = require("../models/AssignedTask");
const AssignedTaskResponse = require("../models/AssignedTaskResponse");
const Client = require("../models/Client");
const Psychologist = require("../models/Psychologist");
const logger = require("../config/logger");

class AssignedTaskController {
  // Yeni görev ata
  async createAssignedTask(req, res) {
    try {
      // Sadece psikologlar görev atayabilir
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const psyc_id = req.user.id;
      const {
        client_id,
        title,
        description,
        iteration_meditation_id,
        meditation_id,
        blog_id,
        article_id,
        breathing_exercise_id,
        test_id,
        start_date,
        finish_date,
        frequency,
        frequency_type,
      } = req.body;

      // En az bir içerik türü seçilmeli
      if (
        !iteration_meditation_id &&
        !meditation_id &&
        !blog_id &&
        !article_id &&
        !breathing_exercise_id &&
        !test_id
      ) {
        return res.status(400).json({
          status: false,
          message: "En az bir içerik türü seçilmelidir",
        });
      }

      const task = await AssignedTask.create({
        client_id,
        psyc_id,
        title,
        description,
        iteration_meditation_id,
        meditation_id,
        blog_id,
        article_id,
        breathing_exercise_id,
        test_id,
        start_date,
        finish_date,
        frequency,
        frequency_type,
        created_by: psyc_id,
      });

      logger.info(`Yeni görev atandı: ${task.id}`);
      return res.status(201).json({
        status: true,
        message: "Görev başarıyla oluşturuldu",
        data: task,
      });
    } catch (error) {
      logger.error(`Görev atama hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görev oluşturulurken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Danışanın görevlerini getir
  async getClientTasks(req, res) {
    try {
      // Sadece danışanlar kendi görevlerini görebilir
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const client_id = req.user.id;
      const tasks = await AssignedTask.findAll({
        where: { client_id, status: ["active", "completed", "overdue"] },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name", "surname"],
            as: "psychologist",
          },
          {
            model: AssignedTaskResponse,
            as: "responses",
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
        order: [["start_date", "DESC"]],
      });

      return res.status(200).json({
        status: true,
        message: "Görevler başarıyla getirildi",
        data: tasks,
      });
    } catch (error) {
      logger.error(`Görev listesi hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görevler getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Psikoloğun atadığı görevleri getir
  async getPsychologistTasks(req, res) {
    try {
      // Sadece psikologlar atadıkları görevleri görebilir
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const psyc_id = req.user.id;
      const tasks = await AssignedTask.findAll({
        where: { psyc_id },
        include: [
          {
            model: Client,
            attributes: ["id", "name", "surname"],
            as: "client",
          },
          {
            model: AssignedTaskResponse,
            as: "responses",
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json({
        status: true,
        message: "Görevler başarıyla getirildi",
        data: tasks,
      });
    } catch (error) {
      logger.error(`Görev listesi hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görevler getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Görev detayı
  async getAssignedTask(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const whereClause =
        user_type === "psychologist"
          ? { id, psyc_id: user_id }
          : { id, client_id: user_id };

      const task = await AssignedTask.findOne({
        where: whereClause,
        include: [
          {
            model: Client,
            attributes: ["id", "name", "surname"],
            as: "client",
          },
          {
            model: Psychologist,
            attributes: ["id", "name", "surname"],
            as: "psychologist",
          },
          {
            model: AssignedTaskResponse,
            as: "responses",
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Görev bulunamadı",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Görev başarıyla getirildi",
        data: task,
      });
    } catch (error) {
      logger.error(`Görev detayı hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görev detayı getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Görev güncelle
  async updateAssignedTask(req, res) {
    try {
      // Sadece psikologlar görev güncelleyebilir
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const { id } = req.params;
      const psyc_id = req.user.id;
      const {
        start_date,
        finish_date,
        frequency,
        frequency_type,
        status,
        title,
        description,
      } = req.body;

      const task = await AssignedTask.findOne({
        where: { id, psyc_id },
      });

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Görev bulunamadı",
        });
      }

      await task.update({
        start_date,
        finish_date,
        frequency,
        frequency_type,
        status,
        title,
        description,
        updated_by: psyc_id,
      });

      logger.info(`Görev güncellendi: ${id}`);
      return res.status(200).json({
        status: true,
        message: "Görev başarıyla güncellendi",
        data: task,
      });
    } catch (error) {
      logger.error(`Görev güncelleme hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görev güncellenirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Görev sil
  async deleteAssignedTask(req, res) {
    try {
      // Sadece psikologlar görev silebilir
      if (req.user.type !== "psychologist") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const { id } = req.params;
      const psyc_id = req.user.id;

      const task = await AssignedTask.findOne({
        where: { id, psyc_id },
      });

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Görev bulunamadı",
        });
      }

      await task.update({
        status: "cancelled",
        updated_by: psyc_id,
      });

      logger.info(`Görev silindi: ${id}`);
      return res.status(200).json({
        status: true,
        message: "Görev başarıyla silindi",
      });
    } catch (error) {
      logger.error(`Görev silme hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Görev silinirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Göreve yanıt ver
  async respondToTask(req, res) {
    try {
      // Sadece danışanlar göreve yanıt verebilir
      if (req.user.type !== "client") {
        return res.status(403).json({
          status: false,
          message: "Bu işlem için yetkiniz bulunmamaktadır",
        });
      }

      const { id } = req.params;
      const client_id = req.user.id;
      const { answer } = req.body;

      const task = await AssignedTask.findOne({
        where: { id, client_id, status: "active" },
      });

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Görev bulunamadı veya tamamlanmış",
        });
      }

      const response = await AssignedTaskResponse.create({
        client_id,
        assigned_task_id: id,
        answer,
        created_by: client_id,
      });

      logger.info(`Göreve yanıt verildi: ${response.id}`);
      return res.status(201).json({
        status: true,
        message: "Yanıt başarıyla gönderildi",
        data: response,
      });
    } catch (error) {
      logger.error(`Görev yanıtı hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Yanıt gönderilirken bir hata oluştu",
        error: error.message,
      });
    }
  }

  // Görev yanıtlarını getir
  async getTaskResponses(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_type = req.user.type;

      const task = await AssignedTask.findOne({
        where:
          user_type === "psychologist"
            ? { id, psyc_id: user_id }
            : { id, client_id: user_id },
      });

      if (!task) {
        return res.status(404).json({
          status: false,
          message: "Görev bulunamadı",
        });
      }

      const responses = await AssignedTaskResponse.findAll({
        where: { assigned_task_id: id },
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json({
        status: true,
        message: "Yanıtlar başarıyla getirildi",
        data: responses,
      });
    } catch (error) {
      logger.error(`Görev yanıtları hatası: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Yanıtlar getirilirken bir hata oluştu",
        error: error.message,
      });
    }
  }
}

module.exports = new AssignedTaskController();

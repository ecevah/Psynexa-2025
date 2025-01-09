const {
  AssignedTask,
  AssignedTaskResponse,
  Client,
  Psychologist,
} = require("../models");
const logger = require("../config/logger");

class AssignedTaskController {
  // Yeni görev ata
  async createAssignedTask(req, res) {
    try {
      const psyc_id = req.user.id;
      const {
        client_id,
        iterations_mediation_id,
        mediation_id,
        blog_id,
        article_id,
        breathing_exercises_id,
        test_id,
        start_date,
        finish_date,
        frequency,
        frequency_type,
      } = req.body;

      const task = await AssignedTask.create({
        client_id,
        psyc_id,
        iterations_mediation_id,
        mediation_id,
        blog_id,
        article_id,
        breathing_exercises_id,
        test_id,
        start_date,
        finish_date,
        frequency,
        frequency_type,
        created_by: psyc_id,
      });

      logger.info(`Yeni görev atandı: ${task.id}`);
      res.status(201).json(task);
    } catch (error) {
      logger.error(`Görev atama hatası: ${error.message}`);
      res.status(500).json({ error: "Görev atanamadı" });
    }
  }

  // Danışanın görevlerini getir
  async getClientTasks(req, res) {
    try {
      const client_id = req.user.id;
      const tasks = await AssignedTask.findAll({
        where: { client_id, status: "active" },
        include: [
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: AssignedTaskResponse,
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
        order: [["start_date", "DESC"]],
      });

      res.json(tasks);
    } catch (error) {
      logger.error(`Görev listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Görevler alınamadı" });
    }
  }

  // Psikoloğun atadığı görevleri getir
  async getPsychologistTasks(req, res) {
    try {
      const psyc_id = req.user.id;
      const tasks = await AssignedTask.findAll({
        where: { psyc_id },
        include: [
          {
            model: Client,
            attributes: ["id", "name"],
          },
          {
            model: AssignedTaskResponse,
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(tasks);
    } catch (error) {
      logger.error(`Görev listesi hatası: ${error.message}`);
      res.status(500).json({ error: "Görevler alınamadı" });
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
            attributes: ["id", "name"],
          },
          {
            model: Psychologist,
            attributes: ["id", "name"],
          },
          {
            model: AssignedTaskResponse,
            attributes: ["id", "answer", "status", "created_at"],
          },
        ],
      });

      if (!task) {
        return res.status(404).json({ error: "Görev bulunamadı" });
      }

      res.json(task);
    } catch (error) {
      logger.error(`Görev detayı hatası: ${error.message}`);
      res.status(500).json({ error: "Görev detayı alınamadı" });
    }
  }

  // Görev güncelle
  async updateAssignedTask(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;
      const { start_date, finish_date, frequency, frequency_type, status } =
        req.body;

      const task = await AssignedTask.findOne({
        where: { id, psyc_id },
      });

      if (!task) {
        return res.status(404).json({ error: "Görev bulunamadı" });
      }

      await task.update({
        start_date,
        finish_date,
        frequency,
        frequency_type,
        status,
        updated_by: psyc_id,
      });

      logger.info(`Görev güncellendi: ${id}`);
      res.json(task);
    } catch (error) {
      logger.error(`Görev güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Görev güncellenemedi" });
    }
  }

  // Görev sil
  async deleteAssignedTask(req, res) {
    try {
      const { id } = req.params;
      const psyc_id = req.user.id;

      const task = await AssignedTask.findOne({
        where: { id, psyc_id },
      });

      if (!task) {
        return res.status(404).json({ error: "Görev bulunamadı" });
      }

      await task.update({
        status: "cancelled",
        updated_by: psyc_id,
      });

      logger.info(`Görev silindi: ${id}`);
      res.json({ message: "Görev başarıyla silindi" });
    } catch (error) {
      logger.error(`Görev silme hatası: ${error.message}`);
      res.status(500).json({ error: "Görev silinemedi" });
    }
  }

  // Göreve yanıt ver
  async respondToTask(req, res) {
    try {
      const { id } = req.params;
      const client_id = req.user.id;
      const { answer } = req.body;

      const task = await AssignedTask.findOne({
        where: { id, client_id },
      });

      if (!task) {
        return res.status(404).json({ error: "Görev bulunamadı" });
      }

      const response = await AssignedTaskResponse.create({
        client_id,
        assigned_task_id: id,
        answer,
        created_by: client_id,
      });

      logger.info(`Göreve yanıt verildi: ${response.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Görev yanıtı hatası: ${error.message}`);
      res.status(500).json({ error: "Göreve yanıt verilemedi" });
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
        return res.status(404).json({ error: "Görev bulunamadı" });
      }

      const responses = await AssignedTaskResponse.findAll({
        where: { assigned_task_id: id },
        order: [["created_at", "DESC"]],
      });

      res.json(responses);
    } catch (error) {
      logger.error(`Görev yanıtları hatası: ${error.message}`);
      res.status(500).json({ error: "Görev yanıtları alınamadı" });
    }
  }
}

module.exports = new AssignedTaskController();

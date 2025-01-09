const express = require("express");
const router = express.Router();
const AssignedTaskController = require("../controllers/AssignedTaskController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: AssignedTasks
 *   description: Assigned task management endpoints
 */

/**
 * @swagger
 * /api/assigned-tasks:
 *   post:
 *     summary: Create a new assigned task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - start_date
 *               - finish_date
 *             properties:
 *               client_id:
 *                 type: integer
 *               iterations_mediation_id:
 *                 type: integer
 *               mediation_id:
 *                 type: integer
 *               blog_id:
 *                 type: integer
 *               article_id:
 *                 type: integer
 *               breathing_exercises_id:
 *                 type: integer
 *               test_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               finish_date:
 *                 type: string
 *                 format: date
 *               frequency:
 *                 type: integer
 *               frequency_type:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *     responses:
 *       201:
 *         description: Task assigned successfully
 */
router.post("/", auth, AssignedTaskController.createAssignedTask);

/**
 * @swagger
 * /api/assigned-tasks/client:
 *   get:
 *     summary: Get all tasks for client
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/client", auth, AssignedTaskController.getClientTasks);

/**
 * @swagger
 * /api/assigned-tasks/psychologist:
 *   get:
 *     summary: Get all tasks assigned by psychologist
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/psychologist", auth, AssignedTaskController.getPsychologistTasks);

/**
 * @swagger
 * /api/assigned-tasks/{id}:
 *   get:
 *     summary: Get a specific task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 */
router.get("/:id", auth, AssignedTaskController.getAssignedTask);

/**
 * @swagger
 * /api/assigned-tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               finish_date:
 *                 type: string
 *                 format: date
 *               frequency:
 *                 type: integer
 *               frequency_type:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put("/:id", auth, AssignedTaskController.updateAssignedTask);

/**
 * @swagger
 * /api/assigned-tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete("/:id", auth, AssignedTaskController.deleteAssignedTask);

/**
 * @swagger
 * /api/assigned-tasks/{id}/respond:
 *   post:
 *     summary: Respond to a task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Response submitted successfully
 */
router.post("/:id/respond", auth, AssignedTaskController.respondToTask);

/**
 * @swagger
 * /api/assigned-tasks/{id}/responses:
 *   get:
 *     summary: Get all responses for a task
 *     tags: [AssignedTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of responses
 */
router.get("/:id/responses", auth, AssignedTaskController.getTaskResponses);

module.exports = router;

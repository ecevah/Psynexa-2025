const express = require("express");
const router = express.Router();
const ReminderController = require("../controllers/ReminderController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Reminder management endpoints
 */

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Create a new reminder
 *     tags: [Reminders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reminder_time
 *               - content
 *               - title
 *             properties:
 *               reminder_time:
 *                 type: string
 *                 format: date-time
 *               content:
 *                 type: string
 *               title:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [once, daily, weekly, monthly]
 *     responses:
 *       201:
 *         description: Reminder created successfully
 */
router.post("/", auth, ReminderController.createReminder);

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Get all active reminders for the client
 *     tags: [Reminders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reminders
 */
router.get("/", auth, ReminderController.getReminders);

/**
 * @swagger
 * /api/reminders/{id}:
 *   get:
 *     summary: Get a specific reminder
 *     tags: [Reminders]
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
 *         description: Reminder details
 */
router.get("/:id", auth, ReminderController.getReminder);

/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     summary: Update a reminder
 *     tags: [Reminders]
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
 *               reminder_time:
 *                 type: string
 *                 format: date-time
 *               content:
 *                 type: string
 *               title:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [once, daily, weekly, monthly]
 *               active:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Reminder updated successfully
 */
router.put("/:id", auth, ReminderController.updateReminder);

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Delete a reminder
 *     tags: [Reminders]
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
 *         description: Reminder deleted successfully
 */
router.delete("/:id", auth, ReminderController.deleteReminder);

/**
 * @swagger
 * /api/reminders/{id}/complete:
 *   put:
 *     summary: Complete a reminder
 *     tags: [Reminders]
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
 *         description: Reminder completed successfully
 */
router.put("/:id/complete", auth, ReminderController.completeReminder);

module.exports = router;

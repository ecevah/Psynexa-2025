const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - text
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           description: Message ID
 *         client_id:
 *           type: integer
 *           description: Client ID
 *         text:
 *           type: string
 *           description: Message content
 *         type:
 *           type: string
 *           enum: [text, image]
 *           description: Message type
 *         status:
 *           type: string
 *           enum: [sent, delivered, read]
 *           description: Message status
 *         response:
 *           type: string
 *           description: Response from psychologist
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - type
 *             properties:
 *               text:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, image]
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post("/", auth, MessageController.sendMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages for the authenticated client
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get("/", auth, MessageController.getMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get a specific message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.get("/:id", auth, MessageController.getMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
router.delete("/:id", auth, MessageController.deleteMessage);

/**
 * @swagger
 * /api/messages/{id}/respond:
 *   post:
 *     summary: Respond to a message (Psychologist only)
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post("/:id/respond", auth, MessageController.respondToMessage);

module.exports = router;

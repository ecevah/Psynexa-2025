const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management endpoints
 */

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a new message
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver_id
 *               - text
 *             properties:
 *               receiver_id:
 *                 type: integer
 *               text:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, image, file]
 *               reply_chat_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post("/send", auth, ChatController.sendMessage);

/**
 * @swagger
 * /api/chat/history/{other_user_id}:
 *   get:
 *     summary: Get chat history with another user
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: other_user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 */
router.get("/history/:other_user_id", auth, ChatController.getChatHistory);

/**
 * @swagger
 * /api/chat/{id}:
 *   put:
 *     summary: Update a message
 *     tags: [Chat]
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
 *               text:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [sent, delivered, read, deleted]
 *     responses:
 *       200:
 *         description: Message updated successfully
 */
router.put("/:id", auth, ChatController.updateMessage);

/**
 * @swagger
 * /api/chat/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
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
 *         description: Message deleted successfully
 */
router.delete("/:id", auth, ChatController.deleteMessage);

/**
 * @swagger
 * /api/chat/unread:
 *   get:
 *     summary: Get unread message count
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unread message count retrieved successfully
 */
router.get("/unread", auth, ChatController.getUnreadCount);

/**
 * @swagger
 * /api/chat/mark-read/{other_user_id}:
 *   put:
 *     summary: Mark messages as read
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: other_user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages marked as read successfully
 */
router.put("/mark-read/:other_user_id", auth, ChatController.markAsRead);

module.exports = router;

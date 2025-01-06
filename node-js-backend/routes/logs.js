const express = require("express");
const router = express.Router();
const logController = require("../controllers/LogController");

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: System logs management endpoints
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get all logs
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: List of all logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   method:
 *                     type: string
 *                   path:
 *                     type: string
 *                   clientId:
 *                     type: string
 *                   responseCode:
 *                     type: integer
 *                   responseTime:
 *                     type: number
 *       500:
 *         description: Server error
 */
router.get("/", logController.getAll.bind(logController));

/**
 * @swagger
 * /api/logs/search:
 *   get:
 *     summary: Search logs by date range
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the search
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the search
 *     responses:
 *       200:
 *         description: List of logs within the date range
 *       400:
 *         description: Invalid date range
 */
router.get("/search", logController.getByDateRange.bind(logController));

/**
 * @swagger
 * /api/logs/client/{clientId}:
 *   get:
 *     summary: Get logs for a specific client
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: List of client's logs
 *       404:
 *         description: Client not found
 */
router.get("/client/:clientId", logController.getByClient.bind(logController));

/**
 * @swagger
 * /api/logs/method/{method}:
 *   get:
 *     summary: Get logs by HTTP method
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE]
 *         description: HTTP Method
 *     responses:
 *       200:
 *         description: List of logs for the specified method
 */
router.get("/method/:method", logController.getByMethod.bind(logController));

/**
 * @swagger
 * /api/logs/response-code/{code}:
 *   get:
 *     summary: Get logs by response code
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: integer
 *         description: HTTP Response Code
 *     responses:
 *       200:
 *         description: List of logs with the specified response code
 */
router.get(
  "/response-code/:code",
  logController.getByResponseCode.bind(logController)
);

/**
 * @swagger
 * /api/logs/{id}:
 *   get:
 *     summary: Get a log entry by ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *     responses:
 *       200:
 *         description: Log entry details
 *       404:
 *         description: Log not found
 */
router.get("/:id", logController.getById.bind(logController));

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Create a new log entry
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *               - path
 *               - responseCode
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [GET, POST, PUT, DELETE]
 *               path:
 *                 type: string
 *               clientId:
 *                 type: string
 *               responseCode:
 *                 type: integer
 *               responseTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Log entry created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", logController.create.bind(logController));

/**
 * @swagger
 * /api/logs/{id}:
 *   delete:
 *     summary: Delete a log entry
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *     responses:
 *       200:
 *         description: Log entry deleted successfully
 *       404:
 *         description: Log not found
 */
router.delete("/:id", logController.delete.bind(logController));

module.exports = router;

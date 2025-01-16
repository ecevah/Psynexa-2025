const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const auth = require("../middleware/auth");
const staffAuth = require("../middleware/staffAuth");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments (Staff Only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", staffAuth, PaymentController.getAllPayments);

/**
 * @swagger
 * /api/payments/client:
 *   get:
 *     summary: Get all payments for the authenticated client
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of client's payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   packageId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 */
router.get("/client", auth, PaymentController.getClientPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.get("/:id", auth, PaymentController.getPayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - package_id
 *               - payment_method
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Ödeme tutarı
 *               package_id:
 *                 type: integer
 *                 description: Paket ID
 *               payment_method:
 *                 type: string
 *                 enum: [credit_card, bank_transfer]
 *                 description: Ödeme yöntemi
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     client_id:
 *                       type: integer
 *                     package_id:
 *                       type: integer
 *                     amount:
 *                       type: number
 *                     payment_method:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid input - Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, PaymentController.createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update a payment (Staff Only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.put("/:id", staffAuth, PaymentController.updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete a payment (Staff Only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.delete("/:id", staffAuth, PaymentController.deletePayment);

module.exports = router;

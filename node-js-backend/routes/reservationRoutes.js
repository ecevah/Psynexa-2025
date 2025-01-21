const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/ReservationController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - psyc_id
 *         - date
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: integer
 *         client_id:
 *           type: integer
 *         psyc_id:
 *           type: integer
 *         payment_id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         pay_status:
 *           type: string
 *           enum: [pending, paid, refunded, cancelled]
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - psyc_id
 *               - date
 *               - start_time
 *               - end_time
 *             properties:
 *               psyc_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.post("/", auth, ReservationController.createReservation);

/**
 * @swagger
 * /api/reservations/psychologist:
 *   get:
 *     summary: Get all reservations for psychologist
 *     tags: [Reservations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get(
  "/psychologist",
  auth,
  ReservationController.getPsychologistReservations
);

/**
 * @swagger
 * /api/reservations/client:
 *   get:
 *     summary: Get all reservations for client
 *     tags: [Reservations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/client", auth, ReservationController.getClientReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a specific reservation
 *     tags: [Reservations]
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
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.get("/:id", auth, ReservationController.getReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
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
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: time
 *               end_time:
 *                 type: string
 *                 format: time
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *               pay_status:
 *                 type: string
 *                 enum: [pending, paid, refunded, cancelled]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.put("/:id", auth, ReservationController.updateReservation);

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
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
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/:id/cancel", auth, ReservationController.cancelReservation);

module.exports = router;

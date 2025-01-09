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
 *               - time
 *             properties:
 *               psyc_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
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
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *               pay_status:
 *                 type: string
 *                 enum: [pending, paid, refunded, cancelled]
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 */
router.put("/:id", auth, ReservationController.updateReservation);

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   put:
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
 */
router.put("/:id/cancel", auth, ReservationController.cancelReservation);

module.exports = router;

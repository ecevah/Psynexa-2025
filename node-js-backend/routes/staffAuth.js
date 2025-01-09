const express = require("express");
const router = express.Router();
const StaffAuthController = require("../controllers/StaffAuthController");
const { authLimiter } = require("../middleware/rateLimiter");
const staffAuth = require("../middleware/staffAuth");

/**
 * @swagger
 * /api/staff/auth/register:
 *   post:
 *     summary: Register a new staff member
 *     tags: [Staff Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *               - identity_number
 *               - phone
 *               - restrictions_id
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               identity_number:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               restrictions_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Staff member registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/register", staffAuth, StaffAuthController.register);

/**
 * @swagger
 * /api/staff/auth/login:
 *   post:
 *     summary: Login staff member
 *     tags: [Staff Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", authLimiter, StaffAuthController.login);

module.exports = router;

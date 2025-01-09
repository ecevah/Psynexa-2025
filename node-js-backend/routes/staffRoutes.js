const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management endpoints
 */

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff members
 */
router.get("/", auth, StaffController.getAll.bind(StaffController));

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get a specific staff member
 *     tags: [Staff]
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
 *         description: Staff member details
 */
router.get("/:id", auth, StaffController.getById.bind(StaffController));

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - password
 *               - email
 *               - date_of_birth
 *               - identity_number
 *               - phone
 *               - restrictions_id
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               identity_number:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: boolean
 *               restrictions_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Staff member created successfully
 */
router.post("/", auth, StaffController.create.bind(StaffController));

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update a staff member
 *     tags: [Staff]
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
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *               identity_number:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: boolean
 *               restrictions_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 */
router.put("/:id", auth, StaffController.update.bind(StaffController));

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete a staff member
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Staff member deleted successfully
 */
router.delete("/:id", auth, StaffController.delete.bind(StaffController));

/**
 * @swagger
 * /api/staff/{id}/status:
 *   put:
 *     summary: Update staff member status
 *     tags: [Staff]
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
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Staff member status updated successfully
 */
router.put(
  "/:id/status",
  auth,
  StaffController.updateStatus.bind(StaffController)
);

module.exports = router;

const express = require("express");
const router = express.Router();
const WorkingAreaController = require("../controllers/WorkingAreaController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Working Areas
 *   description: Working area management endpoints
 */

/**
 * @swagger
 * /api/working-areas:
 *   get:
 *     summary: Get all working areas
 *     tags: [Working Areas]
 *     responses:
 *       200:
 *         description: List of all working areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", WorkingAreaController.getAllWorkingAreas);

/**
 * @swagger
 * /api/working-areas/psychologist:
 *   get:
 *     summary: Get all working areas for the authenticated psychologist
 *     tags: [Working Areas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of psychologist's working areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/psychologist",
  auth,
  WorkingAreaController.getPsychologistWorkingAreas
);

/**
 * @swagger
 * /api/working-areas/{id}:
 *   get:
 *     summary: Get a working area by ID
 *     tags: [Working Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Working Area ID
 *     responses:
 *       200:
 *         description: Working area details
 *       404:
 *         description: Working area not found
 *       500:
 *         description: Server error
 */
router.get("/:id", WorkingAreaController.getWorkingArea);

/**
 * @swagger
 * /api/working-areas:
 *   post:
 *     summary: Create a new working area
 *     tags: [Working Areas]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               certificates:
 *                 type: object
 *     responses:
 *       201:
 *         description: Working area created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, WorkingAreaController.createWorkingArea);

/**
 * @swagger
 * /api/working-areas/{id}:
 *   put:
 *     summary: Update a working area
 *     tags: [Working Areas]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               certificates:
 *                 type: object
 *     responses:
 *       200:
 *         description: Working area updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Working area not found
 */
router.put("/:id", auth, WorkingAreaController.updateWorkingArea);

/**
 * @swagger
 * /api/working-areas/{id}:
 *   delete:
 *     summary: Delete a working area
 *     tags: [Working Areas]
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
 *         description: Working area deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Working area not found
 */
router.delete("/:id", auth, WorkingAreaController.deleteWorkingArea);

module.exports = router;

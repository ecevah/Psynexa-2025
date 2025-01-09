const express = require("express");
const router = express.Router();
const MeditationController = require("../controllers/MeditationController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Meditations
 *   description: Meditation management endpoints
 */

/**
 * @swagger
 * /api/meditations:
 *   post:
 *     summary: Create a new meditation
 *     tags: [Meditations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               bibliography:
 *                 type: string
 *               background_url:
 *                 type: string
 *               vocalization_url:
 *                 type: string
 *               sound_url:
 *                 type: string
 *               content_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meditation created successfully
 */
router.post("/", auth, MeditationController.createMeditation);

/**
 * @swagger
 * /api/meditations:
 *   get:
 *     summary: Get all published meditations
 *     tags: [Meditations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meditations
 */
router.get("/", auth, MeditationController.getMeditations);

/**
 * @swagger
 * /api/meditations/psychologist:
 *   get:
 *     summary: Get all meditations for psychologist
 *     tags: [Meditations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meditations
 */
router.get(
  "/psychologist",
  auth,
  MeditationController.getPsychologistMeditations
);

/**
 * @swagger
 * /api/meditations/{id}:
 *   get:
 *     summary: Get a specific meditation
 *     tags: [Meditations]
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
 *         description: Meditation details
 */
router.get("/:id", auth, MeditationController.getMeditation);

/**
 * @swagger
 * /api/meditations/{id}:
 *   put:
 *     summary: Update a meditation
 *     tags: [Meditations]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               bibliography:
 *                 type: string
 *               background_url:
 *                 type: string
 *               vocalization_url:
 *                 type: string
 *               sound_url:
 *                 type: string
 *               content_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meditation updated successfully
 */
router.put("/:id", auth, MeditationController.updateMeditation);

/**
 * @swagger
 * /api/meditations/{id}:
 *   delete:
 *     summary: Delete a meditation
 *     tags: [Meditations]
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
 *         description: Meditation deleted successfully
 */
router.delete("/:id", auth, MeditationController.deleteMeditation);

module.exports = router;

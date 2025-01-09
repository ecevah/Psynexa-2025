const express = require("express");
const router = express.Router();
const MeditationIterationsController = require("../controllers/MeditationIterationsController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: MeditationIterations
 *   description: Meditation iterations management endpoints
 */

/**
 * @swagger
 * /api/meditation-iterations:
 *   post:
 *     summary: Create a new meditation iteration
 *     tags: [MeditationIterations]
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
 *               - content_type
 *             properties:
 *               title:
 *                 type: string
 *               content_type:
 *                 type: string
 *               background_sound:
 *                 type: string
 *               description:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - order
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     media_url:
 *                       type: string
 *                     description_sound_url:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     timer:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Meditation iteration created successfully
 */
router.post(
  "/",
  auth,
  MeditationIterationsController.createMeditationIteration
);

/**
 * @swagger
 * /api/meditation-iterations:
 *   get:
 *     summary: Get all meditation iterations
 *     tags: [MeditationIterations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meditation iterations
 */
router.get("/", auth, MeditationIterationsController.getMeditationIterations);

/**
 * @swagger
 * /api/meditation-iterations/psychologist:
 *   get:
 *     summary: Get all meditation iterations for psychologist
 *     tags: [MeditationIterations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meditation iterations
 */
router.get(
  "/psychologist",
  auth,
  MeditationIterationsController.getPsychologistMeditationIterations
);

/**
 * @swagger
 * /api/meditation-iterations/{id}:
 *   get:
 *     summary: Get a specific meditation iteration
 *     tags: [MeditationIterations]
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
 *         description: Meditation iteration details
 */
router.get("/:id", auth, MeditationIterationsController.getMeditationIteration);

/**
 * @swagger
 * /api/meditation-iterations/{id}:
 *   put:
 *     summary: Update a meditation iteration
 *     tags: [MeditationIterations]
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
 *               content_type:
 *                 type: string
 *               background_sound:
 *                 type: string
 *               description:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     media_url:
 *                       type: string
 *                     description_sound_url:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     timer:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Meditation iteration updated successfully
 */
router.put(
  "/:id",
  auth,
  MeditationIterationsController.updateMeditationIteration
);

/**
 * @swagger
 * /api/meditation-iterations/{id}:
 *   delete:
 *     summary: Delete a meditation iteration
 *     tags: [MeditationIterations]
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
 *         description: Meditation iteration deleted successfully
 */
router.delete(
  "/:id",
  auth,
  MeditationIterationsController.deleteMeditationIteration
);

module.exports = router;

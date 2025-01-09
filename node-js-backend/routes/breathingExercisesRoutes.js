const express = require("express");
const router = express.Router();
const BreathingExercisesController = require("../controllers/BreathingExercisesController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: BreathingExercises
 *   description: Breathing exercises management endpoints
 */

/**
 * @swagger
 * /api/breathing-exercises:
 *   post:
 *     summary: Create a new breathing exercise
 *     tags: [BreathingExercises]
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               iterations:
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
 *                     description_sound:
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
 *         description: Breathing exercise created successfully
 */
router.post("/", auth, BreathingExercisesController.createBreathingExercise);

/**
 * @swagger
 * /api/breathing-exercises:
 *   get:
 *     summary: Get all breathing exercises
 *     tags: [BreathingExercises]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of breathing exercises
 */
router.get("/", auth, BreathingExercisesController.getBreathingExercises);

/**
 * @swagger
 * /api/breathing-exercises/psychologist:
 *   get:
 *     summary: Get all breathing exercises for psychologist
 *     tags: [BreathingExercises]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of breathing exercises
 */
router.get(
  "/psychologist",
  auth,
  BreathingExercisesController.getPsychologistBreathingExercises
);

/**
 * @swagger
 * /api/breathing-exercises/{id}:
 *   get:
 *     summary: Get a specific breathing exercise
 *     tags: [BreathingExercises]
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
 *         description: Breathing exercise details
 */
router.get("/:id", auth, BreathingExercisesController.getBreathingExercise);

/**
 * @swagger
 * /api/breathing-exercises/{id}:
 *   put:
 *     summary: Update a breathing exercise
 *     tags: [BreathingExercises]
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               iterations:
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
 *                     description_sound:
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
 *         description: Breathing exercise updated successfully
 */
router.put("/:id", auth, BreathingExercisesController.updateBreathingExercise);

/**
 * @swagger
 * /api/breathing-exercises/{id}:
 *   delete:
 *     summary: Delete a breathing exercise
 *     tags: [BreathingExercises]
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
 *         description: Breathing exercise deleted successfully
 */
router.delete(
  "/:id",
  auth,
  BreathingExercisesController.deleteBreathingExercise
);

module.exports = router;

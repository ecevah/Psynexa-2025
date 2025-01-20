const express = require("express");
const router = express.Router();
const MeditationController = require("../controllers/MeditationController");
const auth = require("../middleware/auth");
const { upload } = require("../config/multer");

/**
 * @swagger
 * tags:
 *   name: Meditations
 *   description: Meditation management endpoints
 */

/**
 * @swagger
 * /api/meditations/my:
 *   get:
 *     summary: Get all meditations for the logged-in psychologist
 *     tags: [Meditations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of psychologist's meditations
 */
router.get("/my", auth, MeditationController.getPsychologistMeditations);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               content:
 *                 type: string
 *                 description: Text content of the meditation
 *               background_image:
 *                 type: string
 *                 format: binary
 *               vocalization:
 *                 type: string
 *                 format: binary
 *               sound:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Meditation created successfully
 */
router.post(
  "/",
  auth,
  upload.fields([
    { name: "background_image", maxCount: 1 },
    { name: "vocalization", maxCount: 1 },
    { name: "sound", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  MeditationController.createMeditation
);

/**
 * @swagger
 * /api/meditations:
 *   get:
 *     summary: Get all active meditations
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               content:
 *                 type: string
 *                 description: Text content of the meditation
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               background_image:
 *                 type: string
 *                 format: binary
 *               vocalization:
 *                 type: string
 *                 format: binary
 *               sound:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Meditation updated successfully
 */
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "background_image", maxCount: 1 },
    { name: "vocalization", maxCount: 1 },
    { name: "sound", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  MeditationController.updateMeditation
);

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

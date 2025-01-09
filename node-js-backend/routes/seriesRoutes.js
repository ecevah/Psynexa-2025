const express = require("express");
const router = express.Router();
const SeriesController = require("../controllers/SeriesController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Series
 *   description: Series management endpoints
 */

/**
 * @swagger
 * /api/series:
 *   post:
 *     summary: Create a new series
 *     tags: [Series]
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
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               contents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     iterations_mediation_id:
 *                       type: integer
 *                     mediation_id:
 *                       type: integer
 *                     blog_id:
 *                       type: integer
 *                     article_id:
 *                       type: integer
 *                     breathing_exercises_id:
 *                       type: integer
 *                     type:
 *                       type: string
 *                       enum: [meditation, blog, article, breathing]
 *     responses:
 *       201:
 *         description: Series created successfully
 */
router.post("/", auth, SeriesController.createSeries);

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Get all series for the client
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of series
 */
router.get("/", auth, SeriesController.getClientSeries);

/**
 * @swagger
 * /api/series/{id}:
 *   get:
 *     summary: Get a specific series
 *     tags: [Series]
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
 *         description: Series details
 */
router.get("/:id", auth, SeriesController.getSeries);

/**
 * @swagger
 * /api/series/{id}:
 *   put:
 *     summary: Update a series
 *     tags: [Series]
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
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               contents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     iterations_mediation_id:
 *                       type: integer
 *                     mediation_id:
 *                       type: integer
 *                     blog_id:
 *                       type: integer
 *                     article_id:
 *                       type: integer
 *                     breathing_exercises_id:
 *                       type: integer
 *                     type:
 *                       type: string
 *                       enum: [meditation, blog, article, breathing]
 *     responses:
 *       200:
 *         description: Series updated successfully
 */
router.put("/:id", auth, SeriesController.updateSeries);

/**
 * @swagger
 * /api/series/{id}:
 *   delete:
 *     summary: Delete a series
 *     tags: [Series]
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
 *         description: Series deleted successfully
 */
router.delete("/:id", auth, SeriesController.deleteSeries);

/**
 * @swagger
 * /api/series/{id}/content:
 *   post:
 *     summary: Add content to a series
 *     tags: [Series]
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
 *               - type
 *             properties:
 *               iterations_mediation_id:
 *                 type: integer
 *               mediation_id:
 *                 type: integer
 *               blog_id:
 *                 type: integer
 *               article_id:
 *                 type: integer
 *               breathing_exercises_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [meditation, blog, article, breathing]
 *     responses:
 *       201:
 *         description: Content added successfully
 */
router.post("/:id/content", auth, SeriesController.addContent);

/**
 * @swagger
 * /api/series/{id}/content/{content_id}:
 *   delete:
 *     summary: Remove content from a series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: content_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content removed successfully
 */
router.delete("/:id/content/:content_id", auth, SeriesController.removeContent);

module.exports = router;

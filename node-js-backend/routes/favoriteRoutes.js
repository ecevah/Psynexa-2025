const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/FavoriteController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite management endpoints
 */

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Create a new favorite
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               series_id:
 *                 type: integer
 *               content_id:
 *                 type: integer
 *               meditation_id:
 *                 type: integer
 *               breathing_exercises_id:
 *                 type: integer
 *               meditation_iterations_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [series, content, meditation, breathing, iteration]
 *     responses:
 *       201:
 *         description: Favorite created successfully
 */
router.post("/", auth, FavoriteController.createFavorite);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorites for the client
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [series, content, meditation, breathing, iteration]
 *         description: Filter favorites by type
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get("/", auth, FavoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Get a specific favorite
 *     tags: [Favorites]
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
 *         description: Favorite details
 */
router.get("/:id", auth, FavoriteController.getFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Delete a favorite
 *     tags: [Favorites]
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
 *         description: Favorite deleted successfully
 */
router.delete("/:id", auth, FavoriteController.deleteFavorite);

/**
 * @swagger
 * /api/favorites/check/{type}/{id}:
 *   get:
 *     summary: Check if an item is favorited
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [series, content, meditation, breathing, iteration]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *                 favorite_id:
 *                   type: integer
 */
router.get("/check/:type/:id", auth, FavoriteController.checkFavoriteStatus);

module.exports = router;

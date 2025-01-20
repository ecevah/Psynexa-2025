const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/ArticleController");
const auth = require("../middleware/auth");
const { upload } = require("../config/multer");

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management endpoints
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
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
 *               - content_type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               content_type:
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
 *         description: Article created successfully
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
  ArticleController.createArticle
);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all published articles
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get("/", auth, ArticleController.getArticles);

/**
 * @swagger
 * /api/articles/psychologist:
 *   get:
 *     summary: Get all articles for psychologist
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get("/psychologist", auth, ArticleController.getPsychologistArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get a specific article
 *     tags: [Articles]
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
 *         description: Article details
 */
router.get("/:id", auth, ArticleController.getArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
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
 *               content_type:
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
 *         description: Article updated successfully
 */
router.put("/:id", auth, ArticleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
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
 *         description: Article deleted successfully
 */
router.delete("/:id", auth, ArticleController.deleteArticle);

module.exports = router;

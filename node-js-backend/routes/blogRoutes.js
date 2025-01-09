const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
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
 *         description: Blog created successfully
 */
router.post("/", auth, BlogController.createBlog);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all published blogs
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/", auth, BlogController.getBlogs);

/**
 * @swagger
 * /api/blogs/psychologist:
 *   get:
 *     summary: Get all blogs for psychologist
 *     tags: [Blogs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/psychologist", auth, BlogController.getPsychologistBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a specific blog
 *     tags: [Blogs]
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
 *         description: Blog details
 */
router.get("/:id", auth, BlogController.getBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
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
 *         description: Blog updated successfully
 */
router.put("/:id", auth, BlogController.updateBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
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
 *         description: Blog deleted successfully
 */
router.delete("/:id", auth, BlogController.deleteBlog);

module.exports = router;

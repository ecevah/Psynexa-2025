const express = require("express");
const router = express.Router();
const PackageController = require("../controllers/PackageController");
const staffAuth = require("../middleware/staffAuth");

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management endpoints (Staff Only)
 */

/**
 * @swagger
 * /api/packages/active:
 *   get:
 *     summary: Get all active packages (Public)
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: List of all active packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       duration:
 *                         type: integer
 *                       session_count:
 *                         type: integer
 *                       features:
 *                         type: object
 *                       status:
 *                         type: boolean
 *       500:
 *         description: Server error
 */
router.get("/active", PackageController.getActivePackages);

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Get all packages (Public)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all packages
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
 *                   price:
 *                     type: number
 *                   sessionCount:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/", staffAuth, PackageController.getAllPackages);

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get a package by ID (Public)
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package details
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.get("/:id", PackageController.getPackage);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package (Staff Only)
 *     tags: [Packages]
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
 *               - price
 *               - sessionCount
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sessionCount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff only
 */
router.post("/", staffAuth, PackageController.createPackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update a package (Staff Only)
 *     tags: [Packages]
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
 *               price:
 *                 type: number
 *               sessionCount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff only
 *       404:
 *         description: Package not found
 */
router.put("/:id", staffAuth, PackageController.updatePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Delete a package (Staff Only)
 *     tags: [Packages]
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
 *         description: Package deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff only
 *       404:
 *         description: Package not found
 */
router.delete("/:id", staffAuth, PackageController.deletePackage);

module.exports = router;

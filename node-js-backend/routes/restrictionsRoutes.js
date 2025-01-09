const express = require("express");
const router = express.Router();
const RestrictionsController = require("../controllers/RestrictionsController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Restrictions
 *   description: Staff restrictions management endpoints
 */

/**
 * @swagger
 * /api/restrictions:
 *   get:
 *     summary: Get all restrictions
 *     tags: [Restrictions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of restrictions
 */
router.get(
  "/",
  auth,
  RestrictionsController.getAll.bind(RestrictionsController)
);

/**
 * @swagger
 * /api/restrictions/{id}:
 *   get:
 *     summary: Get a specific restrictions
 *     tags: [Restrictions]
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
 *         description: Restrictions details
 */
router.get(
  "/:id",
  auth,
  RestrictionsController.getById.bind(RestrictionsController)
);

/**
 * @swagger
 * /api/restrictions:
 *   post:
 *     summary: Create new restrictions
 *     tags: [Restrictions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_view:
 *                 type: boolean
 *               client_edit:
 *                 type: boolean
 *               client_delete:
 *                 type: boolean
 *               client_ban:
 *                 type: boolean
 *               client_password:
 *                 type: boolean
 *               client_contact:
 *                 type: boolean
 *               reservation_view:
 *                 type: boolean
 *               reservation_edit:
 *                 type: boolean
 *               reservation_delete:
 *                 type: boolean
 *               psyc_view:
 *                 type: boolean
 *               psyc_edit:
 *                 type: boolean
 *               psyc_delete:
 *                 type: boolean
 *               psyc_ban:
 *                 type: boolean
 *               psyc_password:
 *                 type: boolean
 *               psyc_contact:
 *                 type: boolean
 *               staff_view:
 *                 type: boolean
 *               staff_edit:
 *                 type: boolean
 *               staff_delete:
 *                 type: boolean
 *               staff_ban:
 *                 type: boolean
 *               staff_restrictions:
 *                 type: boolean
 *               staff_password:
 *                 type: boolean
 *               staff_contact:
 *                 type: boolean
 *               content_view:
 *                 type: boolean
 *               content_edit:
 *                 type: boolean
 *               content_delete:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Restrictions created successfully
 */
router.post(
  "/",
  auth,
  RestrictionsController.create.bind(RestrictionsController)
);

/**
 * @swagger
 * /api/restrictions/{id}:
 *   put:
 *     summary: Update restrictions
 *     tags: [Restrictions]
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
 *               client_view:
 *                 type: boolean
 *               client_edit:
 *                 type: boolean
 *               client_delete:
 *                 type: boolean
 *               client_ban:
 *                 type: boolean
 *               client_password:
 *                 type: boolean
 *               client_contact:
 *                 type: boolean
 *               reservation_view:
 *                 type: boolean
 *               reservation_edit:
 *                 type: boolean
 *               reservation_delete:
 *                 type: boolean
 *               psyc_view:
 *                 type: boolean
 *               psyc_edit:
 *                 type: boolean
 *               psyc_delete:
 *                 type: boolean
 *               psyc_ban:
 *                 type: boolean
 *               psyc_password:
 *                 type: boolean
 *               psyc_contact:
 *                 type: boolean
 *               staff_view:
 *                 type: boolean
 *               staff_edit:
 *                 type: boolean
 *               staff_delete:
 *                 type: boolean
 *               staff_ban:
 *                 type: boolean
 *               staff_restrictions:
 *                 type: boolean
 *               staff_password:
 *                 type: boolean
 *               staff_contact:
 *                 type: boolean
 *               content_view:
 *                 type: boolean
 *               content_edit:
 *                 type: boolean
 *               content_delete:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Restrictions updated successfully
 */
router.put(
  "/:id",
  auth,
  RestrictionsController.update.bind(RestrictionsController)
);

/**
 * @swagger
 * /api/restrictions/{id}:
 *   delete:
 *     summary: Delete restrictions
 *     tags: [Restrictions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Restrictions deleted successfully
 *       400:
 *         description: Cannot delete restrictions that are assigned to staff members
 */
router.delete(
  "/:id",
  auth,
  RestrictionsController.delete.bind(RestrictionsController)
);

module.exports = router;

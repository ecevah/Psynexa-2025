const express = require("express");
const router = express.Router();
const psychologistController = require("../controllers/PsychologistController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Psychologists
 *   description: Psychologist management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkingArea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Working area ID
 *         name:
 *           type: string
 *           description: Working area name
 *         description:
 *           type: string
 *           description: Working area description
 *         experience_years:
 *           type: integer
 *           description: Years of experience in this area
 *         certificates:
 *           type: object
 *           description: Certificates related to this area
 */

/**
 * @swagger
 * /api/psychologists:
 *   get:
 *     summary: Get all psychologists
 *     tags: [Psychologists]
 *     responses:
 *       200:
 *         description: List of all psychologists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   title:
 *                     type: string
 *                   specialization:
 *                     type: string
 *                   experience:
 *                     type: integer
 *                   about:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   working_areas:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/WorkingArea'
 *       500:
 *         description: Server error
 */
router.get("/", psychologistController.getAllPsychologists);

/**
 * @swagger
 * /api/psychologists/{id}:
 *   get:
 *     summary: Get a psychologist by ID
 *     tags: [Psychologists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Psychologist ID
 *     responses:
 *       200:
 *         description: Psychologist details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     title:
 *                       type: string
 *                     specialization:
 *                       type: string
 *                     experience:
 *                       type: integer
 *                     about:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     working_areas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkingArea'
 *       404:
 *         description: Psychologist not found
 *       500:
 *         description: Server error
 */
router.get("/:id", psychologistController.getPsychologist);

/**
 * @swagger
 * /api/psychologists:
 *   post:
 *     summary: Create a new psychologist
 *     tags: [Psychologists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - title
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               title:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *               about:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               working_areas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     experience_years:
 *                       type: integer
 *                     certificates:
 *                       type: object
 *     responses:
 *       201:
 *         description: Psychologist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     title:
 *                       type: string
 *                     specialization:
 *                       type: string
 *                     experience:
 *                       type: integer
 *                     about:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     working_areas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkingArea'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, psychologistController.createPsychologist);

/**
 * @swagger
 * /api/psychologists/{id}:
 *   put:
 *     summary: Update a psychologist
 *     tags: [Psychologists]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               title:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *               about:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               working_areas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     experience_years:
 *                       type: integer
 *                     certificates:
 *                       type: object
 *     responses:
 *       200:
 *         description: Psychologist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     title:
 *                       type: string
 *                     specialization:
 *                       type: string
 *                     experience:
 *                       type: integer
 *                     about:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     working_areas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkingArea'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Psychologist not found
 */
router.put("/:id", auth, psychologistController.updatePsychologist);

/**
 * @swagger
 * /api/psychologists/{id}:
 *   delete:
 *     summary: Delete a psychologist
 *     tags: [Psychologists]
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
 *         description: Psychologist deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Psychologist not found
 */
router.delete("/:id", auth, psychologistController.deletePsychologist);

module.exports = router;

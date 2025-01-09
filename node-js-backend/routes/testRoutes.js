const express = require("express");
const router = express.Router();
const TestController = require("../controllers/TestController");
const QuestionController = require("../controllers/QuestionController");
const ResponseController = require("../controllers/ResponseController");
const auth = require("../middleware/auth");
const { upload } = require("../config/multer");

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Test management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: Test ID
 *         title:
 *           type: string
 *           description: Test title
 *         description:
 *           type: string
 *           description: Test description
 *         image_url:
 *           type: string
 *           description: Test image URL
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Question:
 *       type: object
 *       required:
 *         - test_id
 *         - text
 *       properties:
 *         id:
 *           type: integer
 *           description: Question ID
 *         test_id:
 *           type: integer
 *           description: Test ID
 *         text:
 *           type: string
 *           description: Question text
 *         order:
 *           type: integer
 *           description: Question order in test
 *     Response:
 *       type: object
 *       required:
 *         - test_id
 *         - client_id
 *         - answers
 *       properties:
 *         id:
 *           type: integer
 *           description: Response ID
 *         test_id:
 *           type: integer
 *           description: Test ID
 *         client_id:
 *           type: integer
 *           description: Client ID
 *         answers:
 *           type: object
 *           description: Client's answers
 */

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
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
 *               test_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Test created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.post("/", auth, upload.single("test_image"), TestController.createTest);

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.get("/", auth, TestController.getTests);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get a specific test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.get("/:id", auth, TestController.getTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update a test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               test_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Test updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.put(
  "/:id",
  auth,
  upload.single("test_image"),
  TestController.updateTest
);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete a test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test deleted successfully
 */
router.delete("/:id", auth, TestController.deleteTest);

// Question routes
/**
 * @swagger
 * /api/tests/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - test_id
 *               - text
 *             properties:
 *               test_id:
 *                 type: integer
 *               text:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */
router.post("/questions", auth, QuestionController.createQuestion);

/**
 * @swagger
 * /api/tests/{test_id}/questions:
 *   get:
 *     summary: Get all questions for a test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */
router.get("/:test_id/questions", auth, QuestionController.getQuestions);

/**
 * @swagger
 * /api/tests/questions/{id}:
 *   get:
 *     summary: Get a specific question
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */
router.get("/questions/:id", auth, QuestionController.getQuestion);

/**
 * @swagger
 * /api/tests/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 */
router.put("/questions/:id", auth, QuestionController.updateQuestion);

/**
 * @swagger
 * /api/tests/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 */
router.delete("/questions/:id", auth, QuestionController.deleteQuestion);

/**
 * @swagger
 * /api/tests/{test_id}/questions/order:
 *   put:
 *     summary: Update question order in a test
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Question order updated successfully
 */
router.put(
  "/:test_id/questions/order",
  auth,
  QuestionController.updateQuestionOrder
);

// Response routes
/**
 * @swagger
 * /api/tests/responses:
 *   post:
 *     summary: Save test response
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - test_id
 *               - answers
 *             properties:
 *               test_id:
 *                 type: integer
 *               answers:
 *                 type: object
 *     responses:
 *       201:
 *         description: Response saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
router.post("/responses", auth, ResponseController.saveResponse);

/**
 * @swagger
 * /api/tests/{test_id}/responses:
 *   get:
 *     summary: Get test responses for a client
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: List of responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Response'
 */
router.get("/:test_id/responses", auth, ResponseController.getTestResponses);

/**
 * @swagger
 * /api/tests/{test_id}/all-responses:
 *   get:
 *     summary: Get all responses for a test (Psychologist only)
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: test_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: List of all responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Response'
 */
router.get("/:test_id/all-responses", auth, ResponseController.getAllResponses);

/**
 * @swagger
 * /api/tests/responses/{id}:
 *   delete:
 *     summary: Delete a response
 *     tags: [Tests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Response ID
 *     responses:
 *       200:
 *         description: Response deleted successfully
 */
router.delete("/responses/:id", auth, ResponseController.deleteResponse);

module.exports = router;

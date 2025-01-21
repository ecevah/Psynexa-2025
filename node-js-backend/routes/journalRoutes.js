const express = require("express");
const router = express.Router();
const JournalController = require("../controllers/JournalController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Journals
 *   description: Journal management endpoints
 */

/**
 * @swagger
 * /api/journals:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journals]
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               mood:
 *                 type: string
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 */
router.post("/", auth, JournalController.createJournal);

/**
 * @swagger
 * /api/journals:
 *   get:
 *     summary: Get all journal entries
 *     tags: [Journals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries
 */
router.get("/", auth, JournalController.getJournals);

/**
 * @swagger
 * /api/journals/{id}:
 *   get:
 *     summary: Get a specific journal entry
 *     tags: [Journals]
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
 *         description: Journal entry details
 */
router.get("/:id", auth, JournalController.getJournal);

/**
 * @swagger
 * /api/journals/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journals]
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
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               mood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 */
router.put("/:id", auth, JournalController.updateJournal);

/**
 * @swagger
 * /api/journals/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journals]
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
 *         description: Journal entry deleted successfully
 */
router.delete("/:id", auth, JournalController.deleteJournal);

/**
 * @swagger
 * /api/journals/{id}/toggle-share:
 *   put:
 *     summary: Toggle journal sharing status
 *     tags: [Journals]
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
 *         description: Journal sharing status toggled successfully
 */
router.put("/:id/toggle-share", auth, JournalController.toggleShareJournal);

// Eski archive endpoint'i için yönlendirme
router.put("/:id/archive", auth, (req, res) => {
  res.status(301).json({
    status: false,
    message:
      "Bu endpoint artık kullanılmıyor. Lütfen /api/journals/{id}/toggle-share endpoint'ini kullanın.",
  });
});

module.exports = router;

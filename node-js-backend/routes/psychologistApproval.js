const express = require("express");
const router = express.Router();
const staffAuth = require("../middleware/staffAuth");
const {
  updateApprovalStatus,
  getPendingPsychologists,
  getApprovedPsychologists,
  getRejectedPsychologists,
} = require("../controllers/PsychologistApprovalController");

/**
 * @swagger
 * tags:
 *   name: Psychologist Approval
 *   description: Psikolog onay yönetimi endpointleri (Sadece yetkili staff üyeleri erişebilir)
 */

/**
 * @swagger
 * /api/psychologist-approval/{psychologistId}/approval:
 *   put:
 *     summary: Psikolog onay durumunu güncelle
 *     tags: [Psychologist Approval]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: psychologistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Psikoloğun ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Onay durumu başarıyla güncellendi
 *       400:
 *         description: Geçersiz istek
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu işlem için yetkiniz yok
 *       404:
 *         description: Psikolog bulunamadı
 */
router.put("/:psychologistId/approval", staffAuth, updateApprovalStatus);

/**
 * @swagger
 * /api/psychologist-approval/pending:
 *   get:
 *     summary: Onay bekleyen psikologları listele
 *     tags: [Psychologist Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onay bekleyen psikologlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Psychologist'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu işlem için yetkiniz yok
 */
router.get("/pending", staffAuth, getPendingPsychologists);

/**
 * @swagger
 * /api/psychologist-approval/approved:
 *   get:
 *     summary: Onaylanmış psikologları listele
 *     tags: [Psychologist Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onaylanmış psikologlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Psychologist'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu işlem için yetkiniz yok
 */
router.get("/approved", staffAuth, getApprovedPsychologists);

/**
 * @swagger
 * /api/psychologist-approval/rejected:
 *   get:
 *     summary: Reddedilmiş psikologları listele
 *     tags: [Psychologist Approval]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reddedilmiş psikologlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Psychologist'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu işlem için yetkiniz yok
 */
router.get("/rejected", staffAuth, getRejectedPsychologists);

module.exports = router;

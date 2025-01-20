const express = require("express");
const router = express.Router();
const clientAuthController = require("../controllers/ClientAuthController");
const psychologistAuthController = require("../controllers/PsychologistAuthController");
const {
  authLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimiter");
const { upload } = require("../config/multer");
const auth = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Client, Psychologist, WorkingArea } = require("../models");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints for clients and psychologists
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             user:
 *               type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             status:
 *               type: integer
 */

/**
 * @swagger
 * /api/auth/client/register:
 *   post:
 *     summary: Register a new client
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - surname
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               sex:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email or username already exists
 */

/**
 * @swagger
 * /api/auth/client/login:
 *   post:
 *     summary: Login for clients
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/psychologist/register:
 *   post:
 *     summary: Register a new psychologist
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               sex:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               pdf:
 *                 type: string
 *                 format: binary
 *               experience:
 *                 type: integer
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
 *         description: Psychologist registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     psychologist:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         surname:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         date_of_birth:
 *                           type: string
 *                           format: date
 *                         sex:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         image:
 *                           type: string
 *                         pdf:
 *                           type: string
 *                         experience:
 *                           type: integer
 *                         working_areas:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/WorkingArea'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Invalid input or email/username already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/psychologist/login:
 *   post:
 *     summary: Login as psychologist
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     psychologist:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         surname:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         date_of_birth:
 *                           type: string
 *                           format: date
 *                         sex:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         image:
 *                           type: string
 *                         pdf:
 *                           type: string
 *                         experience:
 *                           type: integer
 *                         working_areas:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/WorkingArea'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/client/forgot-password:
 *   post:
 *     summary: Request password reset for client
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/client/reset-password:
 *   post:
 *     summary: Reset client password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/auth/psychologist/forgot-password:
 *   post:
 *     summary: Request password reset for psychologist
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/psychologist/reset-password:
 *   post:
 *     summary: Reset psychologist password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/auth/client/profile:
 *   get:
 *     summary: Get client profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /api/auth/psychologist/profile:
 *   get:
 *     summary: Get psychologist profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Psychologist profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /api/auth/client/refresh-token:
 *   post:
 *     summary: Refresh client access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /api/auth/psychologist/refresh-token:
 *   post:
 *     summary: Refresh psychologist access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */

// Token yenileme ve çıkış route'ları
router.post("/client/refresh-token", clientAuthController.refreshToken);
router.post("/client/logout", clientAuthController.logout);
router.post(
  "/psychologist/refresh-token",
  psychologistAuthController.refreshToken
);
router.post("/psychologist/logout", psychologistAuthController.logout);

// Google OAuth routes for Client
router.get(
  "/client/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "client",
  })
);

// Google OAuth routes for Psychologist
router.get(
  "/psychologist/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "psychologist",
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=true`,
    })(req, res, (err) => {
      if (err) {
        console.error("Google callback error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
            err.message || "Giriş başarısız"
          )}`
        );
      }
      if (!req.user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
            "Psikolog hesabı bulunamadı. Lütfen önce normal kayıt olun."
          )}`
        );
      }
      next();
    });
  },
  (req, res) => {
    try {
      const { user, userType } = req.user;
      const token = jwt.sign(
        { id: user.id, type: userType },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      // Frontend'e yönlendir
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&userType=${userType}`
      );
    } catch (error) {
      console.error("Token oluşturma hatası:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
          "Giriş işlemi başarısız oldu"
        )}`
      );
    }
  }
);

// Client routes
router.post(
  "/client/register",
  upload.single("photo"),
  clientAuthController.register
);
router.post("/client/login", authLimiter, clientAuthController.login);
router.post(
  "/client/forgot-password",
  passwordResetLimiter,
  clientAuthController.forgotPassword
);
router.post(
  "/client/reset-password",
  passwordResetLimiter,
  clientAuthController.resetPassword
);
router.put(
  "/client/photo",
  auth,
  upload.single("photo"),
  clientAuthController.updatePhoto
);

// Psychologist routes
router.post(
  "/psychologist/register",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  (err, req, res, next) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
    next();
  },
  psychologistAuthController.register
);
router.post(
  "/psychologist/login",
  authLimiter,
  psychologistAuthController.login
);
router.post(
  "/psychologist/forgot-password",
  passwordResetLimiter,
  psychologistAuthController.forgotPassword
);
router.post(
  "/psychologist/reset-password",
  passwordResetLimiter,
  psychologistAuthController.resetPassword
);
router.put(
  "/psychologist/files",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  psychologistAuthController.updateFiles
);

// Client profile route
router.get("/client/profile", auth, async (req, res) => {
  try {
    const client = await Client.findByPk(req.user.id, {
      attributes: {
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });
    if (!client) {
      return res.status(404).json({
        status: false,
        message: "Kullanıcı bulunamadı",
      });
    }
    res.status(200).json({
      status: true,
      data: { ...client.toJSON(), userType: "client" },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Psychologist profile route
router.get("/psychologist/profile", auth, async (req, res) => {
  try {
    const psychologist = await Psychologist.findByPk(req.user.id, {
      include: [
        {
          model: WorkingArea,
          as: "workingAreas",
          attributes: [
            "id",
            "name",
            "description",
            "experience_years",
            "certificates",
            "status",
          ],
        },
      ],
      attributes: {
        exclude: ["password", "reset_token", "reset_token_expiry"],
      },
    });
    if (!psychologist) {
      return res.status(404).json({
        status: false,
        message: "Kullanıcı bulunamadı",
      });
    }
    res.status(200).json({
      status: true,
      data: { ...psychologist.toJSON(), userType: "psychologist" },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;

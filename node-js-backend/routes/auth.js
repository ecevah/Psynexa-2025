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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/psychologist/register:
 *   post:
 *     summary: Register a new psychologist
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
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Psychologist registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/auth/psychologist/login:
 *   post:
 *     summary: Login for psychologists
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
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
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
  passport.authenticate("google", { session: false }),
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
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
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

module.exports = router;

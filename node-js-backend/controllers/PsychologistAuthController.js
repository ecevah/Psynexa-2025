const { Psychologist } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");
const crypto = require("crypto");
const emailService = require("../services/emailService");
const tokenService = require("../services/tokenService");
const { Op } = require("sequelize");
const { deleteFile } = require("../config/multer");
const path = require("path");

class PsychologistAuthController {
  // Register
  async register(req, res) {
    try {
      const { email, username } = req.body;

      const existingPsychologist = await Psychologist.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingPsychologist) {
        if (req.files) {
          Object.values(req.files).forEach((files) => {
            files.forEach((file) => deleteFile(file.path));
          });
        }
        return res.status(400).json({
          error: "Bu email veya kullanıcı adı zaten kullanımda",
        });
      }

      if (req.files) {
        if (req.files.image) {
          req.body.image = path.relative("public", req.files.image[0].path);
        }
        if (req.files.pdf) {
          req.body.pdf = path.relative("public", req.files.pdf[0].path);
        }
      }

      const psychologist = await Psychologist.create(req.body);

      if (req.files) {
        const moveFile = async (file) => {
          const oldPath = file.path;
          const newPath = oldPath.replace("temp", psychologist.id.toString());
          const newDir = path.dirname(newPath);

          require("fs").mkdirSync(newDir, { recursive: true });
          require("fs").renameSync(oldPath, newPath);

          return path.relative("public", newPath);
        };

        const updates = {};
        if (req.files.image) {
          updates.image = await moveFile(req.files.image[0]);
        }
        if (req.files.pdf) {
          updates.pdf = await moveFile(req.files.pdf[0]);
        }

        if (Object.keys(updates).length > 0) {
          await psychologist.update(updates);
        }
      }

      // Token'ları oluştur
      const { accessToken, refreshToken, refreshTokenExpiry } =
        tokenService.generateTokens(psychologist.id, "psychologist");

      // Refresh token'ı kaydet
      await tokenService.saveRefreshToken(
        refreshToken,
        psychologist.id,
        "psychologist",
        refreshTokenExpiry
      );

      // Hoşgeldin emaili gönder
      await emailService.sendWelcomeEmail(
        psychologist.email,
        psychologist.name,
        "psychologist"
      );

      logger.info(`Yeni psikolog kaydı oluşturuldu: ${psychologist.email}`);
      res.status(201).json({
        psychologist,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => deleteFile(file.path));
        });
      }
      logger.error(`Kayıt hatası: ${error.message}`);
      res.status(500).json({ error: "Kayıt işlemi başarısız" });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const psychologist = await Psychologist.findOne({ where: { email } });

      if (!psychologist) {
        return res.status(401).json({ error: "Geçersiz email veya şifre" });
      }

      const isMatch = await psychologist.validatePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Geçersiz email veya şifre" });
      }

      // Token'ları oluştur
      const { accessToken, refreshToken, refreshTokenExpiry } =
        tokenService.generateTokens(psychologist.id, "psychologist");

      // Refresh token'ı kaydet
      await tokenService.saveRefreshToken(
        refreshToken,
        psychologist.id,
        "psychologist",
        refreshTokenExpiry
      );

      logger.info(`Psikolog giriş yaptı: ${psychologist.email}`);
      res.json({
        psychologist,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error(`Giriş hatası: ${error.message}`);
      res.status(500).json({ error: "Giriş işlemi başarısız" });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token gerekli" });
      }

      // Refresh token'ı doğrula
      const { userId, userType } = await tokenService.verifyRefreshToken(
        refreshToken
      );

      // Yeni token'ları oluştur
      const tokens = tokenService.generateTokens(userId, userType);

      // Eski refresh token'ı sil ve yenisini kaydet
      await tokenService.deleteRefreshToken(refreshToken);
      await tokenService.saveRefreshToken(
        tokens.refreshToken,
        userId,
        userType,
        tokens.refreshTokenExpiry
      );

      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      logger.error(`Token yenileme hatası: ${error.message}`);
      res.status(401).json({ error: error.message });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await tokenService.deleteRefreshToken(refreshToken);
      }

      res.json({ message: "Başarıyla çıkış yapıldı" });
    } catch (error) {
      logger.error(`Çıkış hatası: ${error.message}`);
      res.status(500).json({ error: "Çıkış işlemi başarısız" });
    }
  }

  // Dosya güncelleme
  async updateFiles(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.user.id);

      if (!psychologist) {
        if (req.files) {
          Object.values(req.files).forEach((files) => {
            files.forEach((file) => deleteFile(file.path));
          });
        }
        return res.status(404).json({ error: "Psikolog bulunamadı" });
      }

      const updates = {};

      // Profil fotoğrafı güncelleme
      if (req.files.image) {
        if (psychologist.image) {
          deleteFile(path.join("public", psychologist.image));
        }
        updates.image = path.relative("public", req.files.image[0].path);
      }

      // PDF güncelleme
      if (req.files.pdf) {
        if (psychologist.pdf) {
          deleteFile(path.join("public", psychologist.pdf));
        }
        updates.pdf = path.relative("public", req.files.pdf[0].path);
      }

      if (Object.keys(updates).length > 0) {
        await psychologist.update(updates);
      }

      res.json({
        message: "Dosyalar güncellendi",
        image: psychologist.image,
        pdf: psychologist.pdf,
      });
    } catch (error) {
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => deleteFile(file.path));
        });
      }
      logger.error(`Dosya güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Dosya güncelleme işlemi başarısız" });
    }
  }

  // Şifremi Unuttum
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const psychologist = await Psychologist.findOne({ where: { email } });

      if (!psychologist) {
        return res
          .status(404)
          .json({ error: "Bu email ile kayıtlı psikolog bulunamadı" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 saat

      await psychologist.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      const resetUrl = `${process.env.FRONTEND_URL}/psychologist/reset-password/${resetToken}`;
      await emailService.sendPasswordResetEmail(
        email,
        resetUrl,
        "psychologist"
      );

      logger.info(`Şifre sıfırlama maili gönderildi: ${email}`);
      res.json({
        message: "Şifre sıfırlama linki email adresinize gönderildi",
      });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({ error: "Şifre sıfırlama işlemi başarısız" });
    }
  }

  // Şifre Sıfırlama
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const psychologist = await Psychologist.findOne({
        where: {
          reset_token: token,
          reset_token_expiry: { [Op.gt]: Date.now() },
        },
      });

      if (!psychologist) {
        return res
          .status(400)
          .json({ error: "Geçersiz veya süresi dolmuş token" });
      }

      await psychologist.update({
        password: await bcrypt.hash(password, 10),
        reset_token: null,
        reset_token_expiry: null,
      });

      logger.info(`Şifre başarıyla sıfırlandı: ${psychologist.email}`);
      res.json({ message: "Şifreniz başarıyla güncellendi" });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({ error: "Şifre sıfırlama işlemi başarısız" });
    }
  }
}

module.exports = new PsychologistAuthController();

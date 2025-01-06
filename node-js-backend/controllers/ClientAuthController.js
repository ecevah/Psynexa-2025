const { Client } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");
const crypto = require("crypto");
const emailService = require("../services/emailService");
const tokenService = require("../services/tokenService");
const { Op } = require("sequelize");
const { deleteFile } = require("../config/multer");
const path = require("path");

class ClientAuthController {
  // Register
  async register(req, res) {
    try {
      const { email, username } = req.body;

      const existingClient = await Client.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingClient) {
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(400).json({
          error: "Bu email veya kullanıcı adı zaten kullanımda",
        });
      }

      if (req.file) {
        req.body.photo = path.relative("public", req.file.path);
      }

      const client = await Client.create(req.body);

      if (req.file) {
        const oldPath = req.file.path;
        const newPath = oldPath.replace("temp", client.id.toString());
        const newDir = path.dirname(newPath);

        require("fs").mkdirSync(newDir, { recursive: true });
        require("fs").renameSync(oldPath, newPath);

        await client.update({
          photo: path.relative("public", newPath),
        });
      }

      // Token'ları oluştur
      const { accessToken, refreshToken, refreshTokenExpiry } =
        tokenService.generateTokens(client.id, "client");

      // Refresh token'ı kaydet
      await tokenService.saveRefreshToken(
        refreshToken,
        client.id,
        "client",
        refreshTokenExpiry
      );

      // Hoşgeldin emaili gönder
      await emailService.sendWelcomeEmail(client.email, client.name);

      logger.info(`Yeni client kaydı oluşturuldu: ${client.email}`);
      res.status(201).json({
        client,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      logger.error(`Kayıt hatası: ${error.message}`);
      res.status(500).json({ error: "Kayıt işlemi başarısız" });
    }
  }

  // Profil fotoğrafı güncelleme
  async updatePhoto(req, res) {
    try {
      const client = await Client.findByPk(req.user.id);

      if (!client) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      // Eski fotoğrafı sil
      if (client.photo) {
        deleteFile(path.join("public", client.photo));
      }

      // Yeni fotoğrafı kaydet
      if (req.file) {
        const photoPath = path.relative("public", req.file.path);
        await client.update({ photo: photoPath });
      }

      res.json({
        message: "Profil fotoğrafı güncellendi",
        photo: client.photo,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      logger.error(`Fotoğraf güncelleme hatası: ${error.message}`);
      res.status(500).json({ error: "Fotoğraf güncelleme işlemi başarısız" });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const client = await Client.findOne({ where: { email } });

      if (!client) {
        return res.status(401).json({ error: "Geçersiz email veya şifre" });
      }

      const isMatch = await client.validatePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Geçersiz email veya şifre" });
      }

      // Token'ları oluştur
      const { accessToken, refreshToken, refreshTokenExpiry } =
        tokenService.generateTokens(client.id, "client");

      // Refresh token'ı kaydet
      await tokenService.saveRefreshToken(
        refreshToken,
        client.id,
        "client",
        refreshTokenExpiry
      );

      logger.info(`Client giriş yaptı: ${client.email}`);
      res.json({
        client,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      logger.error(`Giriş hatası: ${error.message}`);
      res.status(500).json({ error: "Giriş işlemi başarısız" });
    }
  }

  // Şifremi Unuttum
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const client = await Client.findOne({ where: { email } });

      if (!client) {
        return res
          .status(404)
          .json({ error: "Bu email ile kayıtlı kullanıcı bulunamadı" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 saat

      await client.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await emailService.sendPasswordResetEmail(email, resetUrl);

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
      const client = await Client.findOne({
        where: {
          reset_token: token,
          reset_token_expiry: { [Op.gt]: Date.now() },
        },
      });

      if (!client) {
        return res
          .status(400)
          .json({ error: "Geçersiz veya süresi dolmuş token" });
      }

      await client.update({
        password: await bcrypt.hash(password, 10),
        reset_token: null,
        reset_token_expiry: null,
      });

      logger.info(`Şifre başarıyla sıfırlandı: ${client.email}`);
      res.json({ message: "Şifreniz başarıyla güncellendi" });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({ error: "Şifre sıfırlama işlemi başarısız" });
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
}

module.exports = new ClientAuthController();

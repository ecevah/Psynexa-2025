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
const fetch = require("node-fetch");

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
          status: false,
          message: "Bu email veya kullanıcı adı zaten kullanımda",
        });
      }

      if (req.file) {
        req.body.photo = path.relative("public", req.file.path);
      }

      // Harici API ile kaydı doğrula
      const validationResult = await this.validateRegistration(req.body);
      if (!validationResult.isValid) {
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(validationResult.status || 400).json({
          status: false,
          message: "Harici kayıt doğrulaması başarısız oldu",
        });
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
        status: true,
        message: "Kayıt işlemi başarıyla tamamlandı",
        data: {
          client,
          accessToken,
          refreshToken,
        },
        client_id: validationResult.client_id,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      logger.error(`Kayıt hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Kayıt işlemi başarısız",
      });
    }
  }

  // Profil fotoğrafı güncelleme
  async updatePhoto(req, res) {
    try {
      const client = await Client.findByPk(req.user.id);

      if (!client) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({
          status: false,
          message: "Kullanıcı bulunamadı",
        });
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
        status: true,
        message: "Profil fotoğrafı güncellendi",
        photo: client.photo,
      });
    } catch (error) {
      if (req.file) deleteFile(req.file.path);
      logger.error(`Fotoğraf güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Fotoğraf güncelleme işlemi başarısız",
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const client = await Client.findOne({ where: { email } });

      if (!client) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
        });
      }

      const isMatch = await client.validatePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
        });
      }

      // Harici API ile doğrulama yap
      const isValidAccess = await this.validateClientAccess(
        client.id,
        client.language || "tr"
      );
      if (!isValidAccess) {
        return res.status(401).json({
          status: false,
          message: "Erişim reddedildi",
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

      // Login response
      logger.info(`Client giriş yaptı: ${client.email}`);
      res.json({
        status: true,
        message: "Giriş başarılı",
        data: {
          client,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error(`Giriş hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Giriş işlemi başarısız",
      });
    }
  }

  // Şifremi Unuttum
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const client = await Client.findOne({ where: { email } });

      if (!client) {
        return res.status(404).json({
          status: false,
          message: "Bu email ile kayıtlı kullanıcı bulunamadı",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 saat

      await client.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}?userType=client`;
      await emailService.sendPasswordResetEmail(email, resetUrl);

      logger.info(`Şifre sıfırlama maili gönderildi: ${email}`);
      res.status(200).json({
        status: true,
        message: "Şifre sıfırlama linki email adresinize gönderildi",
      });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Şifre sıfırlama işlemi başarısız",
      });
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
        return res.status(400).json({
          status: false,
          message: "Geçersiz veya süresi dolmuş token",
        });
      }

      await client.update({
        password: password,
        reset_token: null,
        reset_token_expiry: null,
      });

      logger.info(`Şifre başarıyla sıfırlandı: ${client.email}`);
      res.status(200).json({
        status: true,
        message: "Şifreniz başarıyla güncellendi",
      });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Şifre sıfırlama işlemi başarısız",
      });
    }
  }

  // Validate Client Access
  async validateClientAccess(clientId, clientLanguage) {
    try {
      const response = await fetch("http://147.79.115.249:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_language: clientLanguage,
        }),
      });

      return response.status === 200;
    } catch (error) {
      logger.error(`API doğrulama hatası: ${error.message}`);
      return false;
    }
  }

  // Validate Registration
  async validateRegistration(userData) {
    try {
      const photoBase64 = userData.photo
        ? Buffer.from(userData.photo).toString("base64")
        : "";

      const reqBody = {
        name: userData.name || "",
        mail: userData.email || "",
        username: userData.username || userData.name || "",
        hashed_password: userData.password || "",
        language: userData.language || "tr",
        face_photo: photoBase64,
      };

      const response = await fetch("http://147.79.115.249:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      let responseData = {};
      if (response.status === 200) {
        responseData = await response.json();
      }

      return {
        isValid: response.status === 200,
        status: response.status,
        client_id: responseData.client_id || null,
      };
    } catch (error) {
      logger.error(`Kayıt API doğrulama hatası: ${error.message}`);
      return {
        isValid: false,
        status: 500,
        client_id: null,
      };
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(400)
          .json({ status: false, message: "Refresh token gerekli" });
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
      res.status(401).json({
        status: false,
        message: error.message,
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token gerekli",
        });
      }

      // Refresh token'ı doğrula
      try {
        await tokenService.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz refresh token",
        });
      }

      // Refresh token'ı sil
      await tokenService.deleteRefreshToken(refreshToken);

      res.status(200).json({
        status: true,
        message: "Başarıyla çıkış yapıldı",
      });
    } catch (error) {
      logger.error(`Çıkış hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çıkış işlemi başarısız",
      });
    }
  }
}

module.exports = new ClientAuthController();

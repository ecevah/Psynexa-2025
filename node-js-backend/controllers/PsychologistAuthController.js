const { Psychologist, WorkingArea } = require("../models");
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
      const { email, username, working_areas, ...otherData } = req.body;

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
          status: false,
          message: "Bu email veya kullanıcı adı zaten kullanımda",
          data: null,
        });
      }

      if (req.files) {
        if (req.files.image) {
          otherData.image = path.relative("public", req.files.image[0].path);
        }
        if (req.files.pdf) {
          otherData.pdf = path.relative("public", req.files.pdf[0].path);
        }
      }

      const psychologist = await Psychologist.create({
        email,
        username,
        ...otherData,
      });

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

      // Working Area'ları kaydet
      if (working_areas && Array.isArray(working_areas)) {
        const workingAreaPromises = working_areas.map((area) => {
          return WorkingArea.create({
            ...area,
            psychologist_id: psychologist.id,
          });
        });
        await Promise.all(workingAreaPromises);
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

      // Psikoloğu working area'ları ile birlikte getir
      const registeredPsychologist = await Psychologist.findByPk(
        psychologist.id,
        {
          include: [
            {
              model: WorkingArea,
              attributes: [
                "id",
                "name",
                "description",
                "experience_years",
                "certificates",
              ],
            },
          ],
          attributes: {
            exclude: ["password", "reset_token", "reset_token_expiry"],
          },
        }
      );

      logger.info(`Yeni psikolog kaydı oluşturuldu: ${psychologist.email}`);
      res.status(201).json({
        status: true,
        message: "Kayıt işlemi başarıyla tamamlandı",
        data: {
          psychologist: registeredPsychologist,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => deleteFile(file.path));
        });
      }
      logger.error(`Kayıt hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Kayıt işlemi başarısız",
        data: null,
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const psychologist = await Psychologist.findOne({
        where: { email },
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
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
          exclude: ["reset_token", "reset_token_expiry"],
        },
      });

      if (!psychologist) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
          data: null,
        });
      }

      const isMatch = await psychologist.validatePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
          data: null,
        });
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

      const result = psychologist.toJSON();
      result.userType = "psychologist";

      logger.info(`Psikolog giriş yaptı: ${psychologist.email}`);
      res.json({
        status: true,
        message: "Giriş başarılı",
        data: {
          psychologist: result,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error(`Giriş hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Giriş işlemi başarısız",
        data: null,
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token gerekli",
          data: null,
        });
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
        data: null,
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await tokenService.deleteRefreshToken(refreshToken);
      }

      res.json({
        status: true,
        message: "Başarıyla çıkış yapıldı",
        data: null,
      });
    } catch (error) {
      logger.error(`Çıkış hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Çıkış işlemi başarısız",
        data: null,
      });
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
        return res.status(404).json({
          status: false,
          message: "Psikolog bulunamadı",
          data: null,
        });
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
        status: true,
        message: "Dosyalar güncellendi",
        data: {
          image: psychologist.image,
          pdf: psychologist.pdf,
        },
      });
    } catch (error) {
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => deleteFile(file.path));
        });
      }
      logger.error(`Dosya güncelleme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Dosya güncelleme işlemi başarısız",
        data: null,
      });
    }
  }

  // Şifremi Unuttum
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const psychologist = await Psychologist.findOne({ where: { email } });

      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Bu email ile kayıtlı psikolog bulunamadı",
          data: null,
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 saat

      await psychologist.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });

      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}?userType=psychologist`;
      await emailService.sendPasswordResetEmail(
        email,
        resetUrl,
        "psychologist"
      );

      logger.info(`Şifre sıfırlama maili gönderildi: ${email}`);
      res.status(200).json({
        status: true,
        message: "Şifre sıfırlama linki email adresinize gönderildi",
        data: null,
      });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Şifre sıfırlama işlemi başarısız",
        data: null,
      });
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
        return res.status(400).json({
          status: false,
          message: "Geçersiz veya süresi dolmuş token",
          data: null,
        });
      }

      await psychologist.update({
        password: password,
        reset_token: null,
        reset_token_expiry: null,
      });

      logger.info(`Şifre başarıyla sıfırlandı: ${psychologist.email}`);
      res.status(200).json({
        status: true,
        message: "Şifreniz başarıyla güncellendi",
        data: null,
      });
    } catch (error) {
      logger.error(`Şifre sıfırlama hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Şifre sıfırlama işlemi başarısız",
        data: null,
      });
    }
  }

  // Profil bilgilerini getir
  async getProfile(req, res) {
    try {
      const psychologist = await Psychologist.findByPk(req.user.id, {
        include: [
          {
            model: WorkingArea,
            as: "WorkingAreas",
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

      // Debug için log ekleyelim
      console.log(
        "Raw Psychologist Data:",
        JSON.stringify(psychologist, null, 2)
      );

      if (!psychologist) {
        return res.status(404).json({
          status: false,
          message: "Profil bulunamadı",
          data: null,
        });
      }

      // Raw data'yı kullanalım
      const responseData = psychologist.toJSON();

      // Debug için bir log daha
      console.log("Response Data:", JSON.stringify(responseData, null, 2));

      res.status(200).json({
        status: true,
        data: responseData,
      });
    } catch (error) {
      console.error("Full error:", error); // Tam hatayı görelim
      logger.error(`Profil getirme hatası: ${error.message}`);
      res.status(500).json({
        status: false,
        message: "Profil getirilirken bir hata oluştu",
        data: null,
      });
    }
  }
}

module.exports = new PsychologistAuthController();

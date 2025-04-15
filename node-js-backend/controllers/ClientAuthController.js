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
const fs = require("fs");

class ClientAuthController {
  // Register
  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Veri doğrulama
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email ve şifre zorunludur",
        });
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz email formatı",
        });
      }

      // Sadece email ile kontrol et
      const existingClient = await Client.findOne({
        where: { email },
      });

      if (existingClient) {
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(400).json({
          status: false,
          message: "Bu email zaten kullanımda",
        });
      }

      // Otomatik username oluştur
      if (!req.body.username) {
        req.body.username = email.split("@")[0];
      }

      if (req.file) {
        req.body.photo = path.relative("public", req.file.path);
      }

      // Önce yerel veritabanına kaydet
      const client = await Client.create(req.body);

      // Dosya işlemleri
      if (req.file) {
        const oldPath = req.file.path;
        const newPath = oldPath.replace("temp", client.id.toString());
        const newDir = path.dirname(newPath);

        fs.mkdirSync(newDir, { recursive: true });
        fs.renameSync(oldPath, newPath);

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

      // Varsa hoşgeldin e-postası gönder
      try {
        await emailService.sendWelcomeEmail(client.email, client.name);
      } catch (emailError) {
        logger.error(`Hoşgeldin emaili gönderilemedi: ${emailError.message}`);
      }

      // AI Register API çağrısını yap
      if (process.env.AI_LOGIN_REGISTER_URL) {
        try {
          const apiUrl = process.env.AI_LOGIN_REGISTER_URL;
          const registerEndpoint = apiUrl.endsWith("/")
            ? "register"
            : "/register";
          const fetchResponse = await fetch(apiUrl + registerEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: client.id.toString(),
              language: req.body.language || "turkish",
            }),
          });

          if (fetchResponse.status !== 201) {
            const errorText = await fetchResponse.text();
            logger.error(
              `AI Register API hatası: HTTP ${fetchResponse.status}, Yanıt: ${errorText}`
            );
            // AI hatası durumunda oluşturulan client kaydını sil
            await Client.destroy({ where: { id: client.id } });
            logger.info(`AI API hatası nedeniyle kayıt silindi: ${client.id}`);
            return res.status(500).json({
              status: false,
              message: "ai error: " + errorText,
            });
          } else {
            const data = await fetchResponse.json();
            logger.info("AI Register başarılı:", data);
          }
        } catch (apiError) {
          logger.error(`AI Register API exception: ${apiError.message}`);
          await Client.destroy({ where: { id: client.id } });
          logger.info(`AI API exception nedeniyle kayıt silindi: ${client.id}`);
          return res.status(500).json({
            status: false,
            message: "ai error: " + apiError.message,
          });
        }
      }

      // Başarılı yanıtı hemen dön
      logger.info(`Yeni client kaydı oluşturuldu: ${client.email}`);
      return res.status(201).json({
        status: true,
        message: "Kayıt işlemi başarıyla tamamlandı",
        data: {
          client,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      logger.error(`Kayıt hatası: ${error.message}`);
      logger.error(`Kayıt hata stack: ${error.stack}`);

      // Hata mesajını daha detaylı gönder
      res.status(500).json({
        status: false,
        message: "Kayıt işlemi başarısız",
        error: {
          message: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
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
      // Log gelen isteği
      logger.info(`Giriş isteği alındı: ${req.headers["content-type"]}`);

      // Email ve şifre doğrudan al
      const { email, password } = req.body;

      // Veri doğrulama
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email ve şifre zorunludur",
        });
      }

      // Client'ı bul
      const client = await Client.findOne({ where: { email } });
      if (!client) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz email veya şifre",
        });
      }

      // Şifre doğrulama
      try {
        const isMatch = await client.validatePassword(password);
        if (!isMatch) {
          const manualMatch = await bcrypt.compare(password, client.password);
          if (!manualMatch) {
            return res.status(401).json({
              status: false,
              message: "Geçersiz email veya şifre",
            });
          }
        }
      } catch (pwError) {
        logger.error(`Şifre doğrulama hatası: ${pwError.message}`);
        try {
          const manualMatch = await bcrypt.compare(password, client.password);
          if (!manualMatch) {
            return res.status(401).json({
              status: false,
              message: "Geçersiz email veya şifre",
            });
          }
        } catch (bcryptError) {
          logger.error(`Manuel bcrypt hatası: ${bcryptError.message}`);
          return res.status(500).json({
            status: false,
            message: "Şifre doğrulama hatası",
          });
        }
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

      // AI Login API bildirimi: Hata varsa 500 ile dön
      try {
        const apiUrl = process.env.AI_LOGIN_REGISTER_URL;
        if (apiUrl) {
          const loginEndpoint = apiUrl.endsWith("/") ? "login" : "/login";
          const response = await fetch(apiUrl + loginEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: client.id.toString() }),
          });
          if (response.status !== 200) {
            const errorText = await response.text();
            const aiErrorMsg = `HTTP ${response.status}, Yanıt: ${errorText}`;
            logger.error(`Login AI hatası: ${aiErrorMsg}`);
            return res.status(500).json({
              status: false,
              message: "AI Error: " + aiErrorMsg,
            });
          } else {
            const responseData = await response.json();
            logger.info("AI Login başarılı:", responseData);
          }
        }
      } catch (aiError) {
        logger.error(`AI bildirim hatası: ${aiError.message}`);
        return res.status(500).json({
          status: false,
          message: "AI Error: " + aiError.message,
        });
      }

      // Başarılı yanıtı dön
      logger.info(`Başarılı giriş: ${email}`);
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
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
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

  // Harici API ile Client Access doğrulaması
  async validateClientAccess(clientId, clientLanguage) {
    // Harici API bağlantısı kaldırıldı
    logger.info(
      "Harici API erişim doğrulaması devre dışı bırakıldı, erişim varsayılan olarak kabul ediliyor"
    );
    return true;
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

      // Refresh token'dan kullanıcı bilgilerini al
      let userId, userType;

      try {
        // Token doğrulama ile kullanıcı bilgilerini al
        const tokenData = await tokenService.verifyRefreshToken(refreshToken);
        userId = tokenData.userId;
        userType = tokenData.userType;

        // Refresh token'ı veritabanından sil
        await tokenService.deleteRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({
          status: false,
          message: "Geçersiz refresh token",
        });
      }

      // Önce başarılı yanıtı dön
      res.status(200).json({
        status: true,
        message: "Başarıyla çıkış yapıldı",
      });

      // Yanıt döndükten sonra AI API'sine bildir (fire-and-forget)
      try {
        // URL'de eksik slash kontrolü
        const apiUrl = process.env.AI_LOGIN_REGISTER_URL;
        const logoutEndpoint = apiUrl.endsWith("/") ? "logout" : "/logout";

        fetch(apiUrl + logoutEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: userId.toString(), // req.user.id yerine token'dan çıkardığımız userId kullanılıyor
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP Hatası! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => logger.info("AI Logout başarılı:", data))
          .catch((error) => {
            // Sadece loglama yapıyoruz, kullanıcıya yanıt göndermiyoruz
            logger.error(
              `Çıkış sonrası AI Login Register hatası: ${error.message}`
            );
          });
      } catch (fetchError) {
        // API çağrısı başarısız olsa bile kullanıcı çıkış yapmış olur
        logger.error(`AI Logout fetch hatası: ${fetchError.message}`);
      }
    } catch (error) {
      logger.error(`Çıkış hatası: ${error.message}`);
      console.log(error.message);
      res.status(500).json({
        status: false,
        message: "Çıkış işlemi başarısız",
      });
    }
  }
}

module.exports = new ClientAuthController();

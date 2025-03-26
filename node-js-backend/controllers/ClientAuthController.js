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
          message: "Email ve şifre zorunludur"
        });
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Geçersiz email formatı"
        });
      }

      // Sadece email ile kontrol et
      const existingClient = await Client.findOne({
        where: { email }
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
        req.body.username = email.split('@')[0];
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

      // Yanıt döndükten sonra API çağrısını yap (fire and forget)
      try {
        const apiUrl = process.env.AI_LOGIN_REGISTER_URL;
        const registerEndpoint = apiUrl.endsWith('/') ? 'register' : '/register';
        
        fetch(apiUrl + registerEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({  
            client_id: client.id,
            language: req.body.language || "turkish",
          })
        })
        .then(response => response.json())
        .then(data => logger.info('AI Login Register başarılı:', data))
        .catch(error => {
          logger.error(`AI Login Register hatası: ${error.message}`);
          // Kullanıcıya zaten yanıt döndürüldüğü için burada sadece log kaydı tutuyoruz
        });
      } catch (fetchError) {
        logger.error(`AI Login Register fetch hatası: ${fetchError.message}`);
        // Bu hata kullanıcıya dönmez, sadece log kaydı tutulur
      }
      // Başarılı yanıtı hemen dön
      logger.info(`Yeni client kaydı oluşturuldu: ${client.email}`);
      res.status(201).json({
        status: true,
        message: "Kayıt işlemi başarıyla tamamlandı",
        data: {
          client,
          accessToken,
          refreshToken,
        }
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
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
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
      
      // Client'ı bulmayı dene
      let client;
      try {
        client = await Client.findOne({ where: { email } });
        if (!client) {
          return res.status(401).json({
            status: false,
            message: "Geçersiz email veya şifre",
          });
        }
      } catch (error) {
        logger.error(`Client bulma hatası: ${error.message}`);
        return res.status(500).json({
          status: false,
          message: "Veritabanı hatası oluştu",
        });
      }
      
      // Şifre doğrulamasını dene
      try {
        const isMatch = await client.validatePassword(password);
        if (!isMatch) {
          return res.status(401).json({
            status: false,
            message: "Geçersiz email veya şifre",
          });
        }
      } catch (error) {
        logger.error(`Şifre doğrulama hatası: ${error.message}`);
        return res.status(500).json({
          status: false,
          message: "Şifre doğrulama hatası oluştu",
        });
      }
      
      // API doğrulaması kaldırıldı
      logger.info(`API doğrulaması devre dışı bırakıldı, giriş onaylandı`);
      
      // Token'ları oluştur ve kaydet
      try {
        const { accessToken, refreshToken, refreshTokenExpiry } =
          tokenService.generateTokens(client.id, "client");

        await tokenService.saveRefreshToken(
          refreshToken,
          client.id, 
          "client",
          refreshTokenExpiry
        );
        
        // Önce kullanıcıya başarılı yanıtı gönderelim
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
        
        // Yanıt gönderdikten sonra log amaçlı fetch işlemini yapalım
        // Bu işlemin başarısız olması artık kullanıcının girişini etkilemeyecek
        console.log("AI_LOGIN_REGISTER_URL:", process.env.AI_LOGIN_REGISTER_URL);
        console.log(client.id);
        
        // URL'de eksik slash kontrolü
        const apiUrl = process.env.AI_LOGIN_REGISTER_URL;
        const loginEndpoint = apiUrl.endsWith('/') ? 'login' : '/login';
        
        fetch(process.env.AI_LOGIN_REGISTER_URL + loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({  
            client_id: client.id,
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP Hatası! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => console.log('Başarılı:', data))        
        .catch(error => {
          // Sadece loglama yapıyoruz, kullanıcıya yanıt göndermiyoruz
          logger.error(`Giriş sonrası AI Login Register hatası: ${error.message}`);
        });
        
      } catch (error) {
        logger.error(`Token işlemi hatası: ${error.message}`);
        return res.status(500).json({
          status: false,
          message: "Token oluşturma veya kaydetme hatası",
        });
      }
      
    } catch (error) {
      logger.error(`Genel giriş hatası: ${error.message}`);
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

  // Harici API ile Client Access doğrulaması
  async validateClientAccess(clientId, clientLanguage) {
    // Harici API bağlantısı kaldırıldı
    logger.info("Harici API erişim doğrulaması devre dışı bırakıldı, erişim varsayılan olarak kabul ediliyor");
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
      const { userId, userType } = await tokenService.verifyRefreshToken(refreshToken);

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
        const logoutEndpoint = apiUrl.endsWith('/') ? 'logout' : '/logout';
        
        fetch(apiUrl + logoutEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({  
            client_id: userId,  // req.user.id yerine token'dan çıkardığımız userId kullanılıyor
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP Hatası! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => logger.info('AI Logout başarılı:', data))        
        .catch(error => {
          // Sadece loglama yapıyoruz, kullanıcıya yanıt göndermiyoruz
          logger.error(`Çıkış sonrası AI Login Register hatası: ${error.message}`);
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

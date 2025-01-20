const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { RefreshToken } = require("../models");
const logger = require("../config/logger");

class TokenService {
  generateTokens(userId, userType) {
    // Access Token oluştur
    const accessToken = jwt.sign(
      {
        [userType === "staff" ? "staff_id" : "id"]: userId,
        type: userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    // Refresh Token oluştur
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiry,
    };
  }

  async saveRefreshToken(token, userId, userType, expiresAt) {
    try {
      // Varolan refresh token'ları temizle
      await RefreshToken.destroy({
        where: { user_id: userId, user_type: userType },
      });

      // Yeni refresh token'ı kaydet
      const refreshToken = await RefreshToken.create({
        token,
        user_id: userId,
        user_type: userType,
        expires_at: expiresAt,
      });

      return refreshToken;
    } catch (error) {
      logger.error(`Refresh token kaydetme hatası: ${error.message}`);
      throw new Error("Refresh token kaydedilemedi");
    }
  }

  async verifyRefreshToken(token) {
    try {
      const refreshToken = await RefreshToken.findOne({
        where: { token },
      });

      if (!refreshToken) {
        throw new Error("Geçersiz refresh token");
      }

      if (new Date() > refreshToken.expires_at) {
        await refreshToken.destroy();
        throw new Error("Refresh token süresi dolmuş");
      }

      return {
        userId: refreshToken.user_id,
        userType: refreshToken.user_type,
      };
    } catch (error) {
      logger.error(`Refresh token doğrulama hatası: ${error.message}`);
      throw error;
    }
  }

  async deleteRefreshToken(token) {
    try {
      await RefreshToken.destroy({
        where: { token },
      });
    } catch (error) {
      logger.error(`Refresh token silme hatası: ${error.message}`);
      throw new Error("Refresh token silinemedi");
    }
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Geçersiz access token");
    }
  }
}

module.exports = new TokenService();

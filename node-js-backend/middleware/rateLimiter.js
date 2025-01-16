const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");

// Genel API limiti
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum istek
  message: {
    status: false,
    message:
      "Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit aşıldı - IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

// Auth endpoint'leri için özel limit
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // IP başına maksimum deneme
  message: {
    status: false,
    message:
      "Çok fazla giriş denemesi yaptınız. Lütfen 1 saat sonra tekrar deneyin.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit aşıldı - IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

// Şifre sıfırlama için özel limit
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 3, // IP başına maksimum deneme
  message: {
    status: false,
    message:
      "Çok fazla şifre sıfırlama denemesi yaptınız. Lütfen 1 saat sonra tekrar deneyin.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Password reset rate limit aşıldı - IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
};

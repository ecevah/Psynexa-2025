const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const auth = (req, res, next) => {
  try {
    logger.info("Auth middleware başladı");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    logger.info(`Gelen token: ${token}`);

    if (!token) {
      logger.error("Token bulunamadı");
      throw new Error("Token bulunamadı");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Decoded token: ${JSON.stringify(decoded)}`);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Yetkilendirme hatası: ${error.message}`);
    res.status(401).json({ status: false, message: "Lütfen giriş yapın" });
  }
};

module.exports = auth;

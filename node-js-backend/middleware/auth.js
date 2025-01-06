const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Yetkilendirme hatası: ${error.message}`);
    res.status(401).json({ error: "Lütfen giriş yapın" });
  }
};

module.exports = auth;

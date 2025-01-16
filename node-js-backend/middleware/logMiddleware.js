const { Log } = require("../models");
const logger = require("../config/logger");

const logMiddleware = async (req, res, next) => {
  const startTime = Date.now();
  let logData = null;

  // Response'u yakalamak için orijinal metodları sakla
  const originalJson = res.json;
  const originalEnd = res.end;
  const originalSend = res.send;

  // Kullanıcı bilgisini JWT'den al
  const getUserInfo = (req) => {
    if (!req.user) return { id: null, type: null };

    // Token içindeki type'a göre ID'yi belirle
    const userType = req.user.type;
    const userId = req.user.id;

    if (!userType || !userId) {
      return { id: null, type: null };
    }

    return { id: userId, type: userType };
  };

  // Log verisi oluştur
  const createLogData = (responseBody = null, responseCode = null) => {
    const userInfo = getUserInfo(req);

    // Debug için
    if (process.env.NODE_ENV === "development") {
      logger.debug(`Creating log with user info:`, {
        token: req.user,
        extracted: userInfo,
      });
    }

    const logData = {
      timestamp: new Date(),
      method: req.method,
      path: req.originalUrl,
      responseCode: responseCode || res.statusCode,
      responseTime: Date.now() - startTime,
      requestBody: req.method !== "GET" ? req.body : null,
      requestParams: Object.keys(req.params).length ? req.params : null,
      requestQuery: Object.keys(req.query).length ? req.query : null,
      responseBody: responseBody,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip || req.connection.remoteAddress,
      isAuthenticated: !!userInfo.id,
    };

    // Kullanıcı tipine göre ilgili ID'yi set et
    if (userInfo.type === "client") {
      logData.client_id = userInfo.id;
    } else if (userInfo.type === "psychologist") {
      logData.psychologist_id = userInfo.id;
    } else if (userInfo.type === "staff") {
      logData.staff_id = userInfo.id;
    }

    return logData;
  };

  // Response metodlarını override et
  res.json = function (data) {
    logData = createLogData(data);
    Log.create(logData).catch((err) => {
      logger.error("Log kayıt hatası:", err);
    });
    return originalJson.call(this, data);
  };

  res.send = function (data) {
    if (!logData) {
      // Eğer json() ile log oluşturulmadıysa
      logData = createLogData(data);
      Log.create(logData).catch((err) => {
        logger.error("Log kayıt hatası:", err);
      });
    }
    return originalSend.call(this, data);
  };

  res.end = function (data) {
    if (!logData) {
      // Eğer json() veya send() ile log oluşturulmadıysa
      logData = createLogData(data);
      Log.create(logData).catch((err) => {
        logger.error("Log kayıt hatası:", err);
      });
    }
    return originalEnd.call(this, data);
  };

  next();
};

module.exports = logMiddleware;

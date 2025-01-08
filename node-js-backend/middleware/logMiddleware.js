const { Log } = require("../models");
const logger = require("../config/logger");

const logMiddleware = async (req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json;
  const originalEnd = res.end;

  // Request başlangıç logunu tut
  const requestLogData = {
    timestamp: new Date(),
    method: req.method,
    path: req.originalUrl,
    clientId: req.user ? req.user.id : null,
    responseCode: null, // Henüz response oluşmadı
    responseTime: null,
    requestBody: req.body,
    requestParams: req.params,
    requestQuery: req.query,
    responseBody: null,
    userAgent: req.get("user-agent"),
    ipAddress: req.ip || req.connection.remoteAddress,
    isAuthenticated: !!req.user,
    requestHeaders: req.headers,
  };

  // Request logunu kaydet
  try {
    await Log.create(requestLogData);
  } catch (error) {
    logger.error("Request log kaydı oluşturulurken hata:", error);
  }

  res.json = async function (data) {
    try {
      const responseTime = Date.now() - startTime;
      const logData = {
        timestamp: new Date(),
        method: req.method,
        path: req.originalUrl,
        clientId: req.user ? req.user.id : null,
        responseCode: res.statusCode,
        responseTime: responseTime,
        requestBody: req.body,
        requestParams: req.params,
        requestQuery: req.query,
        responseBody: data,
        userAgent: req.get("user-agent"),
        ipAddress: req.ip || req.connection.remoteAddress,
        isAuthenticated: !!req.user,
        requestHeaders: req.headers,
      };

      try {
        await Log.create(logData);
      } catch (error) {
        logger.error("Response log kaydı oluşturulurken hata:", error);
      }
    } catch (error) {
      logger.error("Log middleware'de hata:", error);
    } finally {
      originalJson.call(this, data);
    }
  };

  res.end = function (chunk, encoding) {
    try {
      const responseTime = Date.now() - startTime;
      const logData = {
        timestamp: new Date(),
        method: req.method,
        path: req.originalUrl,
        clientId: req.user ? req.user.id : null,
        responseCode: res.statusCode,
        responseTime: responseTime,
        requestBody: req.body,
        requestParams: req.params,
        requestQuery: req.query,
        responseBody: chunk ? chunk.toString() : null,
        userAgent: req.get("user-agent"),
        ipAddress: req.ip || req.connection.remoteAddress,
        isAuthenticated: !!req.user,
        requestHeaders: req.headers,
      };

      // Asenkron olarak log oluştur ve hataları yakala
      Log.create(logData).catch((error) => {
        logger.error("Response log kaydı oluşturulurken hata:", error);
      });
    } catch (error) {
      logger.error("Log middleware'de hata:", error);
    } finally {
      originalEnd.call(this, chunk, encoding);
    }
  };

  next();
};

module.exports = logMiddleware;

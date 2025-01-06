const LogController = require("../controllers/LogController");

const logMiddleware = async (req, res, next) => {
  // İstek başlangıç zamanını kaydet
  const startTime = Date.now();

  // Orijinal res.json metodunu sakla
  const originalJson = res.json;

  // res.json metodunu override et
  res.json = function (data) {
    // Response zamanını hesapla
    const responseTime = Date.now() - startTime;

    // Log verilerini hazırla
    const logData = {
      timestamp: new Date(),
      method: req.method,
      path: req.originalUrl,
      clientId: req.user ? req.user.id : null, // Eğer kullanıcı authenticate olmuşsa
      responseCode: res.statusCode,
      responseTime: responseTime,
      requestBody: req.body,
      requestParams: req.params,
      requestQuery: req.query,
      responseBody: data,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip || req.connection.remoteAddress,
    };

    // Log kaydını oluştur
    try {
      LogController.create({ body: logData });
    } catch (error) {
      console.error("Log kaydı oluşturulurken hata:", error);
    }

    // Orijinal json metodunu çağır
    originalJson.call(this, data);
  };

  next();
};

module.exports = logMiddleware;

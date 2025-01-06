const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger/swagger");
require("dotenv").config();
require("./config/passport");

// Route imports
const authRouter = require("./routes/auth");
const psychologistsRouter = require("./routes/psychologists");
const clientsRouter = require("./routes/clients");
const packagesRouter = require("./routes/packages");
const paymentsRouter = require("./routes/payments");
const workingAreasRouter = require("./routes/working-areas");
const { apiLimiter } = require("./middleware/rateLimiter");
const logMiddleware = require("./middleware/logMiddleware");

const app = express();

// Database connection
const sequelize = require("./config/database");
sequelize
  .sync()
  .then(() => {
    console.log("📝 Veritabanı tabloları senkronize edildi");
  })
  .catch((error) => {
    console.error("❌ Veritabanı senkronizasyon hatası:", error.message);
  });

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());

// Rate limiting
app.use(apiLimiter);

// Logging middleware - tüm route'lardan önce ekleyin
app.use(logMiddleware);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/psychologists", psychologistsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/working-areas", workingAreasRouter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Error handling
app.use((req, res, next) => {
  const error = new Error("Endpoint bulunamadı");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;

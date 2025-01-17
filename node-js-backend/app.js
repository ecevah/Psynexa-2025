const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
require("dotenv").config();
require("./config/passport");

// Route imports
const authRouter = require("./routes/auth");
const staffAuthRouter = require("./routes/staffAuth");
const psychologistsRouter = require("./routes/psychologists");
const psychologistApprovalRouter = require("./routes/psychologistApproval");
const clientsRouter = require("./routes/clients");
const packagesRouter = require("./routes/packages");
const paymentsRouter = require("./routes/payments");
const workingAreasRouter = require("./routes/working-areas");
const messageRoutes = require("./routes/messageRoutes");
const testRoutes = require("./routes/testRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const meditationRoutes = require("./routes/meditationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const articleRoutes = require("./routes/articleRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const journalRoutes = require("./routes/journalRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const meditationIterationsRoutes = require("./routes/meditationIterationsRoutes");
const breathingExercisesRoutes = require("./routes/breathingExercisesRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const assignedTaskRoutes = require("./routes/assignedTaskRoutes");
const staffRoutes = require("./routes/staffRoutes");
const restrictionsRoutes = require("./routes/restrictionsRoutes");
const testJwtBenchRoutes = require("./routes/testJwtBench");

const { apiLimiter } = require("./middleware/rateLimiter");
const logMiddleware = require("./middleware/logMiddleware");

const app = express();

// Database connection
const sequelize = require("./config/database");
// Veritabanı bağlantısı test ediliyor
sequelize
  .authenticate()
  .then(() => {
    console.log("📝 Veritabanı bağlantısı başarılı");
  })
  .catch((error) => {
    console.error("❌ Veritabanı bağlantı hatası:", error.message);
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
app.use("/api/staff/auth", staffAuthRouter);
app.use("/api/psychologists", psychologistsRouter);
app.use("/api/psychologist-approval", psychologistApprovalRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/working-areas", workingAreasRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/meditations", meditationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/meditation-iterations", meditationIterationsRoutes);
app.use("/api/breathing-exercises", breathingExercisesRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/assigned-tasks", assignedTaskRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/restrictions", restrictionsRoutes);
app.use("/api/testjwtbench", testJwtBenchRoutes);

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

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: false,
    },
  }
);

// Veritabanı bağlantısını test et
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("\n=== Veritabanı Durumu ===");
    console.log("✅ PostgreSQL bağlantısı başarılı");
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`👤 User: ${process.env.DB_USER}`);

    // Tüm tabloları listele
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    console.log("📚 Mevcut tablolar:", tables);
    console.log("============================\n");
  } catch (error) {
    console.error("\n❌ PostgreSQL bağlantı hatası:");
    console.error(`🚫 Hata mesajı: ${error.message}`);
    console.error(
      "⚠️  Lütfen .env dosyasındaki veritabanı bilgilerini kontrol edin"
    );
    console.error("⚠️  PostgreSQL servisinin çalıştığından emin olun\n");
    process.exit(1);
  }
};

// Bağlantıyı test et
testConnection();

module.exports = sequelize;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * components:
 *   schemas:
 *     Psychologist:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Psikolog ID'si
 *         name:
 *           type: string
 *           description: Psikolog adı
 *         surname:
 *           type: string
 *           description: Psikolog soyadı
 *         username:
 *           type: string
 *           description: Kullanıcı adı
 *         email:
 *           type: string
 *           format: email
 *           description: E-posta adresi
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Doğum tarihi
 *         sex:
 *           type: string
 *           description: Cinsiyet
 *         phone:
 *           type: string
 *           description: Telefon numarası
 *         image:
 *           type: string
 *           description: Profil fotoğrafı URL'i
 *         pdf:
 *           type: string
 *           description: CV/Diploma PDF URL'i
 *         experience:
 *           type: integer
 *           description: Deneyim yılı
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Hesap durumu
 *         approve_status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Onay durumu
 *         approve_description:
 *           type: string
 *           description: Onay/red açıklaması
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 */

const Psychologist = sequelize.define(
  "Psychologist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approve_status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    approve_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approve_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "staff",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "psychologists",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (psychologist) => {
        if (psychologist.password) {
          psychologist.password = await bcrypt.hash(psychologist.password, 10);
        }
      },
      beforeUpdate: async (psychologist) => {
        if (psychologist.changed("password")) {
          psychologist.password = await bcrypt.hash(psychologist.password, 10);
        }
      },
    },
  }
);

Psychologist.prototype.validatePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

module.exports = Psychologist;

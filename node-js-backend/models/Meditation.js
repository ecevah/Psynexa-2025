const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Meditation = sequelize.define(
  "Meditation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "psychologists",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duration in minutes",
    },
    background_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vocalization_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sound_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "meditations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Meditation.associate = function (models) {
  // One-to-One ilişkisi: Meditation -> Psychologist
  Meditation.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
  });
};

module.exports = Meditation;

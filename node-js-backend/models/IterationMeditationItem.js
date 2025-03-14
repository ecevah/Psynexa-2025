const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class IterationMeditationItem extends Model {}

IterationMeditationItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    meditation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "iteration_meditations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_sound_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    background_sound_url: {
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in seconds",
    },
    content_type: {
      type: DataTypes.ENUM("text", "audio", "video", "image"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    create_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    create_role: {
      type: DataTypes.ENUM("psychologist", "staff"),
      allowNull: false,
    },
    update_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    update_role: {
      type: DataTypes.ENUM("psychologist", "staff"),
      allowNull: true,
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
    sequelize,
    modelName: "IterationMeditationItem",
    tableName: "iteration_meditation_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = IterationMeditationItem;

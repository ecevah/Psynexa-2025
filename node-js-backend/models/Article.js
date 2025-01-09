const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Article = sequelize.define(
  "Article",
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
    content_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    draft_update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "draft",
    },
    bibliography: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "articles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Article;

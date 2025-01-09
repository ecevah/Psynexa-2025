const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },
    series_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meditation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "meditations",
        key: "id",
      },
    },
    breathing_exercises_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    meditation_iterations_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "series",
        "content",
        "meditation",
        "breathing",
        "iteration"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "archived", "deleted"),
      defaultValue: "active",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "favorites",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Favorite;

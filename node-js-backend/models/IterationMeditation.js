const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const IterationMeditation = sequelize.define(
  "IterationMeditation",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "iteration_meditations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

IterationMeditation.associate = function (models) {
  // One-to-Many relationship with IterationMeditationItem
  IterationMeditation.hasMany(models.IterationMeditationItem, {
    foreignKey: "meditation_id",
    as: "items",
  });

  // Belongs-to relationship with Psychologist
  IterationMeditation.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
  });
};

module.exports = IterationMeditation;

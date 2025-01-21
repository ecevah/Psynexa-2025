const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class IterationMeditation extends Model {}

IterationMeditation.init(
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
    background_sound_url: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "IterationMeditation",
    tableName: "iteration_meditations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = IterationMeditation;

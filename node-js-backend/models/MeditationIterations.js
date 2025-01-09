const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class MeditationIterations extends Model {}

MeditationIterations.init(
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
    content_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    background_sound: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
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
    modelName: "MeditationIterations",
    tableName: "meditation_iterations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
MeditationIterations.belongsTo(require("./Psychologist"), {
  foreignKey: "psyc_id",
});

MeditationIterations.hasMany(require("./MeditationIterationsItem"), {
  foreignKey: "meditation_id",
});

module.exports = MeditationIterations;

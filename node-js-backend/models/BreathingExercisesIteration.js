const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class BreathingExercisesIteration extends Model {}

BreathingExercisesIteration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    breathing_exercises_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "breathing_exercises",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    media_url: {
      type: DataTypes.STRING,
    },
    description_sound: {
      type: DataTypes.STRING,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timer: {
      type: DataTypes.INTEGER,
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
    modelName: "BreathingExercisesIteration",
    tableName: "breathing_exercises_iterations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
BreathingExercisesIteration.belongsTo(require("./BreathingExercises"), {
  foreignKey: "breathing_exercises_id",
});

module.exports = BreathingExercisesIteration;

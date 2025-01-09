const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class BreathingExercises extends Model {}

BreathingExercises.init(
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
    modelName: "BreathingExercises",
    tableName: "breathing_exercises",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
BreathingExercises.belongsTo(require("./Psychologist"), {
  foreignKey: "psyc_id",
});

BreathingExercises.hasMany(require("./BreathingExercisesIteration"), {
  foreignKey: "breathing_exercises_id",
});

module.exports = BreathingExercises;

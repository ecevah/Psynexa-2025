const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BreathingExerciseItem = sequelize.define(
  "BreathingExerciseItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    breathing_exercise_id: {
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
      allowNull: true,
    },
    inhale_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in seconds",
    },
    hold_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in seconds",
    },
    exhale_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in seconds",
    },
    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
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
  },
  {
    tableName: "breathing_exercise_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
BreathingExerciseItem.associate = function (models) {
  // Many-to-One ilişkisi: BreathingExerciseItem -> BreathingExercise
  BreathingExerciseItem.belongsTo(models.BreathingExercise, {
    foreignKey: "breathing_exercise_id",
    as: "breathingExercise",
  });
};

module.exports = BreathingExerciseItem;

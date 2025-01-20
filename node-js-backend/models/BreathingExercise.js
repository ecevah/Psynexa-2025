const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BreathingExercise = sequelize.define(
  "BreathingExercise",
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
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes",
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
  },
  {
    tableName: "breathing_exercises",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
BreathingExercise.associate = function (models) {
  // One-to-One ilişkisi: BreathingExercise -> Psychologist
  BreathingExercise.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
  });

  // One-to-Many ilişkisi: BreathingExercise -> BreathingExerciseItem
  BreathingExercise.hasMany(models.BreathingExerciseItem, {
    foreignKey: "breathing_exercise_id",
    as: "items",
  });
};

module.exports = BreathingExercise;

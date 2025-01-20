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
      references: {
        model: "series",
        key: "id",
      },
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "series_contents",
        key: "id",
      },
    },
    meditation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "meditations",
        key: "id",
      },
    },
    breathing_exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "breathing_exercises",
        key: "id",
      },
    },
    meditation_iteration_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "meditation_iterations",
        key: "id",
      },
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

// İlişkileri tanımla
Favorite.associate = function (models) {
  // One-to-One ilişkisi: Favorite -> Client
  Favorite.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // One-to-One ilişkisi: Favorite -> Series
  Favorite.belongsTo(models.Series, {
    foreignKey: "series_id",
    as: "series",
  });

  // One-to-One ilişkisi: Favorite -> SeriesContent
  Favorite.belongsTo(models.SeriesContent, {
    foreignKey: "content_id",
    as: "content",
  });

  // One-to-One ilişkisi: Favorite -> Meditation
  Favorite.belongsTo(models.Meditation, {
    foreignKey: "meditation_id",
    as: "meditation",
  });

  // One-to-One ilişkisi: Favorite -> BreathingExercise
  Favorite.belongsTo(models.BreathingExercise, {
    foreignKey: "breathing_exercise_id",
    as: "breathingExercise",
  });

  // One-to-One ilişkisi: Favorite -> MeditationIterations
  Favorite.belongsTo(models.IterationMeditation, {
    foreignKey: "meditation_iteration_id",
    as: "meditationIteration",
  });
};

module.exports = Favorite;

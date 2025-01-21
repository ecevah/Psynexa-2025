const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SeriesContent = sequelize.define(
  "SeriesContent",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    series_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "series",
        key: "id",
      },
    },
    meditation_iteration_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "iteration_meditations",
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
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "blogs",
        key: "id",
      },
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "articles",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
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
    tableName: "series_contents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
SeriesContent.associate = function (models) {
  // Many-to-One ilişkisi: SeriesContent -> Series
  SeriesContent.belongsTo(models.Series, {
    foreignKey: "series_id",
    as: "series",
  });

  // One-to-One ilişkiler
  SeriesContent.belongsTo(models.IterationMeditation, {
    foreignKey: "meditation_iteration_id",
    as: "meditationIteration",
  });

  SeriesContent.belongsTo(models.Meditation, {
    foreignKey: "meditation_id",
    as: "meditation",
  });

  SeriesContent.belongsTo(models.Blog, {
    foreignKey: "blog_id",
    as: "blog",
  });

  SeriesContent.belongsTo(models.Article, {
    foreignKey: "article_id",
    as: "article",
  });

  SeriesContent.belongsTo(models.BreathingExercise, {
    foreignKey: "breathing_exercise_id",
    as: "breathingExercise",
  });
};

module.exports = SeriesContent;

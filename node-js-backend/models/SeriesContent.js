const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class SeriesContent extends Model {}

SeriesContent.init(
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
    iterations_mediation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "meditation_iterations",
        key: "id",
      },
    },
    mediation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "meditations",
        key: "id",
      },
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "blogs",
        key: "id",
      },
    },
    article_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "articles",
        key: "id",
      },
    },
    breathing_exercises_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "breathing_exercises",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("meditation", "blog", "article", "breathing"),
      allowNull: false,
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
    modelName: "SeriesContent",
    tableName: "series_contents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
SeriesContent.belongsTo(require("./Series"), {
  foreignKey: "series_id",
});

SeriesContent.belongsTo(require("./MeditationIterations"), {
  foreignKey: "iterations_mediation_id",
});

SeriesContent.belongsTo(require("./Meditation"), {
  foreignKey: "mediation_id",
});

SeriesContent.belongsTo(require("./Blog"), {
  foreignKey: "blog_id",
});

SeriesContent.belongsTo(require("./Article"), {
  foreignKey: "article_id",
});

SeriesContent.belongsTo(require("./BreathingExercises"), {
  foreignKey: "breathing_exercises_id",
});

module.exports = SeriesContent;

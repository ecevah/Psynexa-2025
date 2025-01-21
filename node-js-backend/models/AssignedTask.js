const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class AssignedTask extends Model {}

AssignedTask.init(
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
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "psychologists",
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
    iteration_meditation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "iteration_meditations",
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
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tests",
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
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finish_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    frequency_type: {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled", "overdue"),
      defaultValue: "active",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    sequelize,
    modelName: "AssignedTask",
    tableName: "assigned_tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = AssignedTask;

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
    test_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tests",
        key: "id",
      },
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
    },
    frequency_type: {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
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
    modelName: "AssignedTask",
    tableName: "assigned_tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
AssignedTask.belongsTo(require("./Client"), {
  foreignKey: "client_id",
});

AssignedTask.belongsTo(require("./Psychologist"), {
  foreignKey: "psyc_id",
});

AssignedTask.belongsTo(require("./MeditationIterations"), {
  foreignKey: "iterations_mediation_id",
});

AssignedTask.belongsTo(require("./Meditation"), {
  foreignKey: "mediation_id",
});

AssignedTask.belongsTo(require("./Blog"), {
  foreignKey: "blog_id",
});

AssignedTask.belongsTo(require("./Article"), {
  foreignKey: "article_id",
});

AssignedTask.belongsTo(require("./BreathingExercises"), {
  foreignKey: "breathing_exercises_id",
});

AssignedTask.belongsTo(require("./Test"), {
  foreignKey: "test_id",
});

AssignedTask.hasMany(require("./AssignedTaskResponse"), {
  foreignKey: "assigned_task_id",
});

module.exports = AssignedTask;

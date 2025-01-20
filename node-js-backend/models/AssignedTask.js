const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AssignedTask = sequelize.define(
  "AssignedTask",
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
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "series_contents",
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
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "overdue"),
      defaultValue: "pending",
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
    tableName: "assigned_tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
AssignedTask.associate = function (models) {
  // One-to-One ilişkisi: AssignedTask -> Client
  AssignedTask.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // One-to-One ilişkisi: AssignedTask -> Psychologist
  AssignedTask.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
  });

  // One-to-One ilişkisi: AssignedTask -> Meditation
  AssignedTask.belongsTo(models.Meditation, {
    foreignKey: "meditation_id",
    as: "meditation",
  });

  // One-to-One ilişkisi: AssignedTask -> SeriesContent
  AssignedTask.belongsTo(models.SeriesContent, {
    foreignKey: "content_id",
    as: "content",
  });
};

module.exports = AssignedTask;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reminder = sequelize.define(
  "Reminder",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reminder_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
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
    tableName: "reminders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Reminder.associate = function (models) {
  // One-to-One ilişkisi: Reminder -> Client
  Reminder.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });
};

module.exports = Reminder;

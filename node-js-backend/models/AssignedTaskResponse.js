const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class AssignedTaskResponse extends Model {}

AssignedTaskResponse.init(
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
    assigned_task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "assigned_tasks",
        key: "id",
      },
    },
    answer: {
      type: DataTypes.TEXT,
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
    modelName: "AssignedTaskResponse",
    tableName: "assigned_task_responses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
AssignedTaskResponse.belongsTo(require("./Client"), {
  foreignKey: "client_id",
});

AssignedTaskResponse.belongsTo(require("./AssignedTask"), {
  foreignKey: "assigned_task_id",
});

module.exports = AssignedTaskResponse;

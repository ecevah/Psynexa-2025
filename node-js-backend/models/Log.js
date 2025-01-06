const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    responseCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responseTime: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    requestBody: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    requestParams: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    requestQuery: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    responseBody: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "logs",
  }
);

module.exports = Log;

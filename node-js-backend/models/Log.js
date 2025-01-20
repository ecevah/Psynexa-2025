const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clients",
        key: "id",
      },
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "staff",
        key: "id",
      },
    },
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "psychologists",
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
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
    tableName: "logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Log.associate = function (models) {
  // One-to-One ilişkisi: Log -> Client
  Log.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // One-to-One ilişkisi: Log -> Staff
  Log.belongsTo(models.Staff, {
    foreignKey: "staff_id",
    as: "staff",
  });

  // One-to-One ilişkisi: Log -> Psychologist
  Log.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
  });
};

module.exports = Log;

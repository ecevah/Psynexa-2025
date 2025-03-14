const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
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
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TRY",
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_date: {
      type: DataTypes.DATE,
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
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Payment.associate = function (models) {
  // Many-to-One ilişkisi: Payment -> Client
  Payment.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // Many-to-One ilişkisi: Payment -> Package
  Payment.belongsTo(models.Package, {
    foreignKey: "package_id",
    as: "package",
  });
};

module.exports = Payment;

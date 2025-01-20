const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("client", "psychologist", "staff"),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "refresh_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
RefreshToken.associate = function (models) {
  // Polymorphic ilişkiler
  RefreshToken.belongsTo(models.Client, {
    foreignKey: "user_id",
    constraints: false,
    as: "client",
    scope: {
      user_type: "client",
    },
  });

  RefreshToken.belongsTo(models.Psychologist, {
    foreignKey: "user_id",
    constraints: false,
    as: "psychologist",
    scope: {
      user_type: "psychologist",
    },
  });

  RefreshToken.belongsTo(models.Staff, {
    foreignKey: "user_id",
    constraints: false,
    as: "staff",
    scope: {
      user_type: "staff",
    },
  });
};

module.exports = RefreshToken;

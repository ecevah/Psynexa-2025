const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Response = sequelize.define(
  "Response",
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
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tests",
        key: "id",
      },
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    completion_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Test tamamlama süresi (saniye)",
    },
    status: {
      type: DataTypes.ENUM("started", "completed", "abandoned"),
      defaultValue: "started",
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
    tableName: "responses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Response.associate = function (models) {
  // One-to-One ilişkisi: Response -> Client
  Response.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // One-to-One ilişkisi: Response -> Test
  Response.belongsTo(models.Test, {
    foreignKey: "test_id",
    as: "test",
  });

  Response.belongsTo(models.Question, {
    foreignKey: "question_id",
    as: "question",
  });
};

module.exports = Response;

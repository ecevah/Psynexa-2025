const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Series = sequelize.define(
  "Series",
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
    status: {
      type: DataTypes.ENUM("active", "completed", "archived"),
      defaultValue: "active",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: "series",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// İlişkileri tanımla
Series.associate = function (models) {
  // One-to-One ilişkisi: Series -> Client
  Series.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
  });

  // One-to-Many ilişkisi: Series -> SeriesContent
  Series.hasMany(models.SeriesContent, {
    foreignKey: "series_id",
    as: "contents",
  });
};

module.exports = Series;

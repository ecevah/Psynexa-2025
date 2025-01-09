const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class MeditationIterationsItem extends Model {}

MeditationIterationsItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    meditation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "meditation_iterations",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    media_url: {
      type: DataTypes.STRING,
    },
    description_sound_url: {
      type: DataTypes.STRING,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timer: {
      type: DataTypes.INTEGER,
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
    modelName: "MeditationIterationsItem",
    tableName: "meditation_iterations_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
MeditationIterationsItem.belongsTo(require("./MeditationIterations"), {
  foreignKey: "meditation_id",
});

module.exports = MeditationIterationsItem;

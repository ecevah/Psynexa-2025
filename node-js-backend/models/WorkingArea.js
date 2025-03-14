const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WorkingArea = sequelize.define(
  "WorkingArea",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "psychologists",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    certificates: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "working_areas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

WorkingArea.associate = function (models) {
  // Many-to-One ilişkisi: WorkingArea -> Psychologist
  WorkingArea.belongsTo(models.Psychologist, {
    foreignKey: "psyc_id",
    as: "psychologist",
    onDelete: "CASCADE",
  });
};

module.exports = WorkingArea;

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("staff", "created_type", {
      type: DataTypes.ENUM("staff", "system"),
      allowNull: false,
      defaultValue: "staff",
      after: "created_by",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("staff", "created_type");
  },
};

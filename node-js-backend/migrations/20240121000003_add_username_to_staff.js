"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("staff", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: "id",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("staff", "username");
  },
};

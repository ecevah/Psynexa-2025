"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("series", "created_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("series", "updated_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("series", "created_by");
    await queryInterface.removeColumn("series", "updated_by");
  },
};

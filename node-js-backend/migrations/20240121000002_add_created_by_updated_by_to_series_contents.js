"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("series_contents", "created_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("series_contents", "updated_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("series_contents", "created_by");
    await queryInterface.removeColumn("series_contents", "updated_by");
  },
};

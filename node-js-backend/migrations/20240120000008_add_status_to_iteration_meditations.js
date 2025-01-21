"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("iteration_meditations", "status", {
      type: Sequelize.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("iteration_meditations", "status");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_iteration_meditations_status";'
    );
  },
};

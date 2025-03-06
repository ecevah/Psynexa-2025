"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the existing status column
    await queryInterface.removeColumn("staff", "status");

    // Then, add the new status column with ENUM type
    await queryInterface.addColumn("staff", "status", {
      type: Sequelize.ENUM("active", "inactive", "deleted"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First, remove the ENUM type status column
    await queryInterface.removeColumn("staff", "status");

    // Then, add back the boolean status column
    await queryInterface.addColumn("staff", "status", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    // Remove the ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_staff_status";'
    );
  },
};

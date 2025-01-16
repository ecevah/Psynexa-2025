"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("staff", "date_of_birth", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });

    await queryInterface.addColumn("staff", "identity_number", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: "00000000000",
    });

    await queryInterface.addColumn("staff", "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("staff", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "00000000000",
    });

    await queryInterface.addColumn("staff", "status", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("staff", "date_of_birth");
    await queryInterface.removeColumn("staff", "identity_number");
    await queryInterface.removeColumn("staff", "address");
    await queryInterface.removeColumn("staff", "phone");
    await queryInterface.removeColumn("staff", "status");
  },
};

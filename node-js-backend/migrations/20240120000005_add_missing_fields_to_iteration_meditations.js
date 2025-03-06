"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "iteration_meditations",
      "vocalization_url",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    await queryInterface.addColumn("iteration_meditations", "sound_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("iteration_meditations", "content_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "iteration_meditations",
      "vocalization_url"
    );
    await queryInterface.removeColumn("iteration_meditations", "sound_url");
    await queryInterface.removeColumn("iteration_meditations", "content_url");
  },
};

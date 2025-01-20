"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("iteration_meditation_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      meditation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "iteration_meditations",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description_sound_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Duration in seconds",
      },
      content_type: {
        type: Sequelize.ENUM("text", "audio", "video", "image"),
        allowNull: false,
      },
      create_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      create_role: {
        type: Sequelize.ENUM("psychologist", "staff"),
        allowNull: false,
      },
      update_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      update_role: {
        type: Sequelize.ENUM("psychologist", "staff"),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("iteration_meditation_items");
  },
};

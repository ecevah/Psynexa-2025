module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("breathing_exercise_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      breathing_exercise_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "breathing_exercises",
          key: "id",
        },
        onUpdate: "CASCADE",
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
      inhale_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Duration in seconds",
      },
      hold_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Duration in seconds",
      },
      exhale_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Duration in seconds",
      },
      repetitions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("breathing_exercise_items");
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("favorites", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      series_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "series",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "series_contents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      meditation_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "meditations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      breathing_exercise_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "breathing_exercises",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      meditation_iteration_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "meditation_iterations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: Sequelize.ENUM(
          "series",
          "content",
          "meditation",
          "breathing",
          "iteration"
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "archived", "deleted"),
        defaultValue: "active",
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("favorites");
  },
};

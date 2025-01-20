module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("responses", {
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
      test_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      answers: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      completion_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Test tamamlama süresi (saniye)",
      },
      status: {
        type: Sequelize.ENUM("started", "completed", "abandoned"),
        defaultValue: "started",
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
    await queryInterface.dropTable("responses");
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Assigned Task tablosu
    await queryInterface.createTable("assigned_tasks", {
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
      },
      psychologist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "psychologists",
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "overdue"),
        defaultValue: "pending",
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

    // Assigned Test Response tablosu
    await queryInterface.createTable("assigned_test_responses", {
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
      },
      test_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tests",
          key: "id",
        },
      },
      response_data: {
        type: Sequelize.JSONB,
        allowNull: false,
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

    // Breathing Exercises tablosu
    await queryInterface.createTable("breathing_exercises", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Breathing Exercise Iterations tablosu
    await queryInterface.createTable("breathing_exercise_iterations", {
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
      },
      exercise_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "breathing_exercises",
          key: "id",
        },
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Chat tablosu
    await queryInterface.createTable("chats", {
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
      },
      psychologist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "psychologists",
          key: "id",
        },
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // Meditation Iteration tablosu
    await queryInterface.createTable("meditation_iterations", {
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
      },
      meditation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "meditations",
          key: "id",
        },
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Meditation Iteration Item tablosu
    await queryInterface.createTable("meditation_iteration_items", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      iteration_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "meditation_iterations",
          key: "id",
        },
      },
      step_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Series tablosu
    await queryInterface.createTable("series", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
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

    // Series Content tablosu
    await queryInterface.createTable("series_contents", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      series_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "series",
          key: "id",
        },
      },
      content_type: {
        type: Sequelize.ENUM("meditation", "breathing_exercise", "article"),
        allowNull: false,
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Mevcut tabloları lower snake case'e çevir
    await queryInterface.renameTable("Payments", "payments");
    await queryInterface.renameTable("RefreshTokens", "refresh_tokens");
    await queryInterface.renameTable("Reminders", "reminders");
  },

  down: async (queryInterface, Sequelize) => {
    // Yeni tabloları sil
    await queryInterface.dropTable("series_contents");
    await queryInterface.dropTable("series");
    await queryInterface.dropTable("meditation_iteration_items");
    await queryInterface.dropTable("meditation_iterations");
    await queryInterface.dropTable("chats");
    await queryInterface.dropTable("breathing_exercise_iterations");
    await queryInterface.dropTable("breathing_exercises");
    await queryInterface.dropTable("assigned_test_responses");
    await queryInterface.dropTable("assigned_tasks");

    // Tabloları eski isimlerine geri çevir
    await queryInterface.renameTable("payments", "Payments");
    await queryInterface.renameTable("refresh_tokens", "RefreshTokens");
    await queryInterface.renameTable("reminders", "Reminders");
  },
};

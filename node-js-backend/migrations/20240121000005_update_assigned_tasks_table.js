module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Status default değerini kaldır
    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" DROP DEFAULT'
    );

    // Status enum'ını güncelle
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_assigned_tasks_status" RENAME TO "enum_assigned_tasks_status_old"'
    );

    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_assigned_tasks_status\" AS ENUM ('active', 'completed', 'cancelled', 'overdue')"
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" TYPE "enum_assigned_tasks_status" USING "status"::text::"enum_assigned_tasks_status"'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE "enum_assigned_tasks_status_old"'
    );

    // Status default değerini ayarla
    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" SET DEFAULT \'active\''
    );

    // Önce eski sütunları kaldır
    await queryInterface.removeColumn("assigned_tasks", "content_id");
    await queryInterface.removeColumn("assigned_tasks", "due_date");

    // Yeni sütunları ekle
    await queryInterface.addColumn(
      "assigned_tasks",
      "iteration_meditation_id",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "iteration_meditations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );

    await queryInterface.addColumn("assigned_tasks", "breathing_exercise_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "breathing_exercises",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("assigned_tasks", "blog_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "blogs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("assigned_tasks", "article_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "articles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("assigned_tasks", "test_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tests",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("assigned_tasks", "start_date", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("assigned_tasks", "finish_date", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("assigned_tasks", "frequency", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("assigned_tasks", "frequency_type", {
      type: Sequelize.ENUM("daily", "weekly", "monthly"),
      allowNull: true,
    });

    await queryInterface.addColumn("assigned_tasks", "created_by", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn("assigned_tasks", "updated_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Status default değerini kaldır
    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" DROP DEFAULT'
    );

    // Status enum'ını eski haline getir
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_assigned_tasks_status" RENAME TO "enum_assigned_tasks_status_old"'
    );

    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_assigned_tasks_status\" AS ENUM ('pending', 'completed', 'overdue')"
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" TYPE "enum_assigned_tasks_status" USING "status"::text::"enum_assigned_tasks_status"'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE "enum_assigned_tasks_status_old"'
    );

    // Status default değerini eski haline getir
    await queryInterface.sequelize.query(
      'ALTER TABLE "assigned_tasks" ALTER COLUMN "status" SET DEFAULT \'pending\''
    );

    // Yeni eklenen sütunları kaldır
    await queryInterface.removeColumn(
      "assigned_tasks",
      "iteration_meditation_id"
    );
    await queryInterface.removeColumn(
      "assigned_tasks",
      "breathing_exercise_id"
    );
    await queryInterface.removeColumn("assigned_tasks", "blog_id");
    await queryInterface.removeColumn("assigned_tasks", "article_id");
    await queryInterface.removeColumn("assigned_tasks", "test_id");
    await queryInterface.removeColumn("assigned_tasks", "start_date");
    await queryInterface.removeColumn("assigned_tasks", "finish_date");
    await queryInterface.removeColumn("assigned_tasks", "frequency");
    await queryInterface.removeColumn("assigned_tasks", "frequency_type");
    await queryInterface.removeColumn("assigned_tasks", "created_by");
    await queryInterface.removeColumn("assigned_tasks", "updated_by");

    // Eski sütunları geri ekle
    await queryInterface.addColumn("assigned_tasks", "content_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "series_contents",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("assigned_tasks", "due_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM tiplerini oluştur
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_psychologists_status" AS ENUM ('active', 'inactive');
        EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_psychologists_approve_status" AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Staff tablosu
    await queryInterface.createTable("staff", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restrictions_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Psychologists tablosu
    await queryInterface.createTable("psychologists", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pdf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "inactive"],
        allowNull: false,
        defaultValue: "active",
      },
      reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_token_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approve_status: {
        type: Sequelize.ENUM,
        values: ["pending", "approved", "rejected"],
        allowNull: false,
        defaultValue: "pending",
      },
      approve_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      approve_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "staff",
          key: "id",
        },
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

    // Clients tablosu
    await queryInterface.createTable("clients", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      psyc_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "psychologists",
          key: "id",
        },
      },
      package_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "packages",
          key: "id",
        },
      },
      casual_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_token_expiry: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("clients");
    await queryInterface.dropTable("psychologists");
    await queryInterface.dropTable("staff");

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_psychologists_status";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_psychologists_approve_status";`
    );
  },
};

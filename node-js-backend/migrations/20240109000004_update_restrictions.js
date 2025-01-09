"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eski sütunları kaldır
    await queryInterface.removeColumn("restrictions", "client_view");
    await queryInterface.removeColumn("restrictions", "client_edit");
    await queryInterface.removeColumn("restrictions", "client_delete");
    await queryInterface.removeColumn("restrictions", "client_ban");
    await queryInterface.removeColumn("restrictions", "client_password");
    await queryInterface.removeColumn("restrictions", "client_contact");
    await queryInterface.removeColumn("restrictions", "reservation_view");
    await queryInterface.removeColumn("restrictions", "reservation_edit");
    await queryInterface.removeColumn("restrictions", "reservation_delete");
    await queryInterface.removeColumn("restrictions", "psyc_view");
    await queryInterface.removeColumn("restrictions", "psyc_edit");
    await queryInterface.removeColumn("restrictions", "psyc_delete");
    await queryInterface.removeColumn("restrictions", "psyc_ban");
    await queryInterface.removeColumn("restrictions", "psyc_password");
    await queryInterface.removeColumn("restrictions", "psyc_contact");
    await queryInterface.removeColumn("restrictions", "staff_view");
    await queryInterface.removeColumn("restrictions", "staff_edit");
    await queryInterface.removeColumn("restrictions", "staff_delete");
    await queryInterface.removeColumn("restrictions", "staff_ban");
    await queryInterface.removeColumn("restrictions", "staff_restrictions");
    await queryInterface.removeColumn("restrictions", "staff_password");
    await queryInterface.removeColumn("restrictions", "staff_contact");
    await queryInterface.removeColumn("restrictions", "content_view");
    await queryInterface.removeColumn("restrictions", "content_edit");
    await queryInterface.removeColumn("restrictions", "content_delete");

    // Yeni sütunları ekle
    await queryInterface.addColumn("restrictions", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("restrictions", "permissions", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn("restrictions", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Varsayılan admin rolünü ekle
    await queryInterface.bulkInsert("restrictions", [
      {
        name: "Admin",
        permissions: [
          "view_psychologist_approvals",
          "manage_psychologist_approvals",
          "view_staff",
          "manage_staff",
          "view_restrictions",
          "manage_restrictions",
        ],
        description: "Tüm yetkilere sahip admin rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Moderator",
        permissions: [
          "view_psychologist_approvals",
          "manage_psychologist_approvals",
          "view_staff",
        ],
        description: "Psikolog onaylarını yönetebilen moderatör rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Yeni sütunları kaldır
    await queryInterface.removeColumn("restrictions", "name");
    await queryInterface.removeColumn("restrictions", "permissions");
    await queryInterface.removeColumn("restrictions", "description");

    // Eski sütunları geri ekle
    await queryInterface.addColumn("restrictions", "client_view", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "client_edit", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "client_delete", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "client_ban", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "client_password", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "client_contact", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "reservation_view", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "reservation_edit", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "reservation_delete", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_view", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_edit", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_delete", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_ban", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_password", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "psyc_contact", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_view", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_edit", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_delete", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_ban", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_restrictions", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_password", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "staff_contact", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "content_view", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "content_edit", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("restrictions", "content_delete", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};

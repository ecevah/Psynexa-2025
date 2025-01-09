"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Yeni sütunları ekle
    await queryInterface.addColumn("restrictions", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn("restrictions", "priority_level", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 100,
    });

    await queryInterface.addColumn("restrictions", "metadata", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    });

    // İndexleri ekle
    await queryInterface.addIndex("restrictions", ["is_active"]);
    await queryInterface.addIndex("restrictions", ["priority_level"]);

    // Varsayılan rolleri güncelle
    await queryInterface.bulkDelete("restrictions", null, {});
    await queryInterface.bulkInsert("restrictions", [
      {
        name: "Super Admin",
        permissions: [
          // Psikolog yönetimi
          "view_psychologist_approvals",
          "manage_psychologist_approvals",
          "view_psychologists",
          "manage_psychologists",

          // Staff yönetimi
          "view_staff",
          "manage_staff",
          "view_restrictions",
          "manage_restrictions",

          // İçerik yönetimi
          "view_content",
          "manage_content",
          "publish_content",
          "feature_content",

          // Test yönetimi
          "view_tests",
          "manage_tests",
          "assign_tests",
          "view_test_results",

          // Müşteri yönetimi
          "view_clients",
          "manage_clients",
          "view_client_details",
          "manage_client_status",

          // Paket yönetimi
          "view_packages",
          "manage_packages",
          "assign_packages",

          // Ödeme yönetimi
          "view_payments",
          "manage_payments",
          "process_refunds",

          // Randevu yönetimi
          "view_appointments",
          "manage_appointments",
          "cancel_appointments",

          // Mesajlaşma yönetimi
          "view_messages",
          "manage_messages",
          "send_broadcasts",

          // Raporlama
          "view_reports",
          "generate_reports",
          "export_data",

          // Log yönetimi
          "view_logs",
          "manage_logs",

          // Sistem yönetimi
          "view_settings",
          "manage_settings",
          "manage_integrations",
        ],
        description: "Tüm yetkilere sahip süper admin rolü",
        is_active: true,
        priority_level: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Admin",
        permissions: [
          // Psikolog yönetimi
          "view_psychologist_approvals",
          "manage_psychologist_approvals",
          "view_psychologists",
          "manage_psychologists",

          // Staff yönetimi
          "view_staff",
          "manage_staff",

          // İçerik yönetimi
          "view_content",
          "manage_content",
          "publish_content",

          // Test yönetimi
          "view_tests",
          "manage_tests",
          "assign_tests",
          "view_test_results",

          // Müşteri yönetimi
          "view_clients",
          "manage_clients",
          "view_client_details",

          // Paket ve ödeme yönetimi
          "view_packages",
          "manage_packages",
          "view_payments",
          "manage_payments",

          // Log yönetimi
          "view_logs",
        ],
        description: "Genel yönetim yetkileri olan admin rolü",
        is_active: true,
        priority_level: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Content Manager",
        permissions: [
          // İçerik yönetimi
          "view_content",
          "manage_content",
          "publish_content",
          "feature_content",

          // Test yönetimi
          "view_tests",
          "manage_tests",
          "assign_tests",
        ],
        description: "İçerik ve test yönetimi yapabilen içerik yöneticisi rolü",
        is_active: true,
        priority_level: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Support Manager",
        permissions: [
          // Müşteri yönetimi
          "view_clients",
          "manage_clients",
          "view_client_details",
          "manage_client_status",

          // Paket görüntüleme
          "view_packages",
          "assign_packages",

          // Ödeme görüntüleme
          "view_payments",

          // Randevu yönetimi
          "view_appointments",
          "manage_appointments",
          "cancel_appointments",

          // Mesajlaşma
          "view_messages",
          "manage_messages",
          "send_broadcasts",

          // Raporlama
          "view_reports",
          "generate_reports",

          // Log görüntüleme
          "view_logs",
        ],
        description: "Müşteri destek ekibi yöneticisi rolü",
        is_active: true,
        priority_level: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Support Agent",
        permissions: [
          // Müşteri yönetimi
          "view_clients",
          "view_client_details",

          // Paket ve ödeme görüntüleme
          "view_packages",
          "view_payments",

          // Randevu görüntüleme
          "view_appointments",

          // Mesajlaşma
          "view_messages",
          "manage_messages",

          // Log görüntüleme
          "view_logs",
        ],
        description: "Müşteri destek temsilcisi rolü",
        is_active: true,
        priority_level: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // İndexleri kaldır
    await queryInterface.removeIndex("restrictions", ["is_active"]);
    await queryInterface.removeIndex("restrictions", ["priority_level"]);

    // Sütunları kaldır
    await queryInterface.removeColumn("restrictions", "is_active");
    await queryInterface.removeColumn("restrictions", "priority_level");
    await queryInterface.removeColumn("restrictions", "metadata");

    // Eski rolleri geri yükle
    await queryInterface.bulkDelete("restrictions", null, {});
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
};

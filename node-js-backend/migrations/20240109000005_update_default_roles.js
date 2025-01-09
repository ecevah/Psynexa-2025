"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Varsayılan rolleri güncelle
    await queryInterface.bulkDelete("restrictions", null, {});
    await queryInterface.bulkInsert("restrictions", [
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
          "view_restrictions",
          "manage_restrictions",

          // İçerik yönetimi
          "view_content",
          "manage_content",

          // Test yönetimi
          "view_tests",
          "manage_tests",

          // Müşteri yönetimi
          "view_clients",
          "manage_clients",

          // Paket ve ödeme yönetimi
          "view_packages",
          "manage_packages",
          "view_payments",
          "manage_payments",

          // Log yönetimi
          "view_logs",
        ],
        description: "Tüm yetkilere sahip admin rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Moderator",
        permissions: [
          // Psikolog yönetimi
          "view_psychologist_approvals",
          "manage_psychologist_approvals",
          "view_psychologists",

          // İçerik yönetimi
          "view_content",
          "manage_content",

          // Test yönetimi
          "view_tests",

          // Müşteri yönetimi
          "view_clients",

          // Log yönetimi
          "view_logs",
        ],
        description:
          "Psikolog onayları ve içerik yönetimi yapabilen moderatör rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Content Manager",
        permissions: [
          // İçerik yönetimi
          "view_content",
          "manage_content",

          // Test yönetimi
          "view_tests",
          "manage_tests",
        ],
        description: "İçerik ve test yönetimi yapabilen içerik yöneticisi rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Support",
        permissions: [
          // Müşteri yönetimi
          "view_clients",
          "manage_clients",

          // Paket ve ödeme yönetimi
          "view_packages",
          "view_payments",

          // Log yönetimi
          "view_logs",
        ],
        description: "Müşteri desteği sağlayan destek rolü",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
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

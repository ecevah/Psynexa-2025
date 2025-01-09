const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     Restrictions:
 *       type: object
 *       required:
 *         - name
 *         - permissions
 *       properties:
 *         id:
 *           type: integer
 *           description: Kısıtlama ID'si
 *         name:
 *           type: string
 *           description: Kısıtlama adı (örn. "Admin", "Moderator", "Content Manager")
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               # Psikolog yönetimi
 *               - view_psychologist_approvals
 *               - manage_psychologist_approvals
 *               - view_psychologists
 *               - manage_psychologists
 *               # Staff yönetimi
 *               - view_staff
 *               - manage_staff
 *               - view_restrictions
 *               - manage_restrictions
 *               # İçerik yönetimi
 *               - view_content
 *               - manage_content
 *               - publish_content
 *               - feature_content
 *               # Test yönetimi
 *               - view_tests
 *               - manage_tests
 *               - assign_tests
 *               - view_test_results
 *               # Müşteri yönetimi
 *               - view_clients
 *               - manage_clients
 *               - view_client_details
 *               - manage_client_status
 *               # Paket yönetimi
 *               - view_packages
 *               - manage_packages
 *               - assign_packages
 *               # Ödeme yönetimi
 *               - view_payments
 *               - manage_payments
 *               - process_refunds
 *               # Randevu yönetimi
 *               - view_appointments
 *               - manage_appointments
 *               - cancel_appointments
 *               # Mesajlaşma yönetimi
 *               - view_messages
 *               - manage_messages
 *               - send_broadcasts
 *               # Raporlama
 *               - view_reports
 *               - generate_reports
 *               - export_data
 *               # Log yönetimi
 *               - view_logs
 *               - manage_logs
 *               # Sistem yönetimi
 *               - view_settings
 *               - manage_settings
 *               - manage_integrations
 *           description: İzin listesi
 *         is_active:
 *           type: boolean
 *           description: Rolün aktif olup olmadığı
 *         priority_level:
 *           type: integer
 *           description: Rol öncelik seviyesi (1-100, 1 en yüksek)
 *         description:
 *           type: string
 *           description: Kısıtlama açıklaması
 *         metadata:
 *           type: object
 *           description: Ek bilgiler ve ayarlar
 *         created_by:
 *           type: integer
 *           description: Oluşturan staff ID'si
 *         updated_by:
 *           type: integer
 *           description: Güncelleyen staff ID'si
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

const Restrictions = sequelize.define(
  "Restrictions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidPermissions(value) {
          const validPermissions = [
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
          ];

          if (!Array.isArray(value)) {
            throw new Error("Permissions must be an array");
          }

          const invalidPermissions = value.filter(
            (p) => !validPermissions.includes(p)
          );
          if (invalidPermissions.length > 0) {
            throw new Error(
              `Invalid permissions: ${invalidPermissions.join(", ")}`
            );
          }
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    priority_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 1,
        max: 100,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "staff",
        key: "id",
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "staff",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "restrictions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["priority_level"],
      },
    ],
  }
);

module.exports = Restrictions;

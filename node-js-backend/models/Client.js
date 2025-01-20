const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "psychologists",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "packages",
        key: "id",
      },
    },
    casual_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "clients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (client) => {
        if (client.password) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
      beforeUpdate: async (client) => {
        if (client.changed("password")) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
    },
  }
);

Client.prototype.validatePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// İlişkileri tanımla
Client.associate = function (models) {
  // One-to-Many ilişkisi: Client -> Payment
  Client.hasMany(models.Payment, {
    foreignKey: "client_id",
    as: "payments",
  });

  // One-to-One ilişkisi: Client -> Package
  Client.belongsTo(models.Package, {
    foreignKey: "package_id",
    as: "package",
  });
};

module.exports = Client;

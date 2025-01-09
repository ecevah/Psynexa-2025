const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Chat extends Model {}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },
    psyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "psychologists",
        key: "id",
      },
    },
    sender: {
      type: DataTypes.ENUM("client", "psychologist"),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "image", "file"),
      defaultValue: "text",
    },
    reply_chat_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "chats",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "read", "deleted"),
      defaultValue: "sent",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
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
    sequelize,
    modelName: "Chat",
    tableName: "chats",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Chat.belongsTo(Chat, {
  foreignKey: "reply_chat_id",
  as: "ReplyTo",
});

Chat.belongsTo(require("./Client"), {
  foreignKey: "client_id",
});

Chat.belongsTo(require("./Psychologist"), {
  foreignKey: "psyc_id",
});

module.exports = Chat;

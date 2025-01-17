const Psychologist = require("./Psychologist");
const WorkingArea = require("./WorkingArea");
const Client = require("./Client");
const Package = require("./Package");
const Payment = require("./Payment");
const RefreshToken = require("./RefreshToken");
const Log = require("./Log");
const Message = require("./Message");
const Test = require("./Test");
const Question = require("./Question");
const Response = require("./Response");
const Reservation = require("./Reservation");
const Meditation = require("./Meditation");
const Blog = require("./Blog");
const Article = require("./Article");
const Reminder = require("./Reminder");
const Journal = require("./Journal");
const Favorite = require("./Favorite");
const Staff = require("./Staff");
const Restrictions = require("./Restrictions");

// Önce modelleri tanımla
const models = {
  Psychologist,
  WorkingArea,
  Client,
  Package,
  Payment,
  RefreshToken,
  Log,
  Message,
  Test,
  Question,
  Response,
  Reservation,
  Meditation,
  Blog,
  Article,
  Reminder,
  Journal,
  Favorite,
  Staff,
  Restrictions,
};

// Sonra ilişkileri kur
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test ve Question modelleri arasındaki ilişkiyi tanımlayın
Test.hasMany(Question, { foreignKey: "test_id" });
Question.belongsTo(Test, { foreignKey: "test_id" });

Response.belongsTo(Question, { foreignKey: "question_id" });
Question.hasMany(Response, { foreignKey: "question_id" });

module.exports = models;

const Client = require("./Client");
const Psychologist = require("./Psychologist");
const Package = require("./Package");
const Payment = require("./Payment");
const WorkingArea = require("./WorkingArea");
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

// Client İlişkileri
Client.belongsTo(Psychologist, { foreignKey: "psyc_id" });
Psychologist.hasMany(Client, { foreignKey: "psyc_id" });

Client.belongsTo(Package, { foreignKey: "package_id" });
Package.hasMany(Client, { foreignKey: "package_id" });

Client.hasMany(Journal, { foreignKey: "client_id" });
Journal.belongsTo(Client, { foreignKey: "client_id" });

Client.hasMany(Favorite, { foreignKey: "client_id" });
Favorite.belongsTo(Client, { foreignKey: "client_id" });

Client.hasMany(Reminder, { foreignKey: "client_id" });
Reminder.belongsTo(Client, { foreignKey: "client_id" });

// Payment İlişkileri
Payment.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(Payment, { foreignKey: "client_id" });

Payment.belongsTo(Package, { foreignKey: "package_id" });
Package.hasMany(Payment, { foreignKey: "package_id" });

// WorkingArea İlişkileri
WorkingArea.belongsTo(Psychologist, { foreignKey: "psychologist_id" });
Psychologist.hasMany(WorkingArea, { foreignKey: "psychologist_id" });

// Message İlişkileri
Client.hasMany(Message, { foreignKey: "client_id" });
Message.belongsTo(Client, { foreignKey: "client_id" });
Psychologist.hasMany(Message, { foreignKey: "psychologist_id" });
Message.belongsTo(Psychologist, { foreignKey: "psychologist_id" });

// Test ve İlgili İlişkiler
Psychologist.hasMany(Test, { foreignKey: "created_by" });
Test.belongsTo(Psychologist, { foreignKey: "created_by", as: "creator" });
Test.belongsTo(Psychologist, { foreignKey: "updated_by", as: "updater" });

Test.hasMany(Question, { foreignKey: "test_id" });
Question.belongsTo(Test, { foreignKey: "test_id" });
Psychologist.hasMany(Question, { foreignKey: "created_by" });
Question.belongsTo(Psychologist, { foreignKey: "created_by", as: "creator" });
Question.belongsTo(Psychologist, { foreignKey: "updated_by", as: "updater" });

Client.hasMany(Response, { foreignKey: "client_id" });
Response.belongsTo(Client, { foreignKey: "client_id" });
Test.hasMany(Response, { foreignKey: "test_id" });
Response.belongsTo(Test, { foreignKey: "test_id" });
Question.hasMany(Response, { foreignKey: "question_id" });
Response.belongsTo(Question, { foreignKey: "question_id" });
Client.hasMany(Response, { foreignKey: "created_by" });
Response.belongsTo(Client, { foreignKey: "created_by", as: "creator" });
Response.belongsTo(Client, { foreignKey: "updated_by", as: "updater" });

// Reservation İlişkileri
Reservation.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(Reservation, { foreignKey: "client_id" });
Reservation.belongsTo(Psychologist, { foreignKey: "psychologist_id" });
Psychologist.hasMany(Reservation, { foreignKey: "psychologist_id" });

// Content İlişkileri (Blog, Article, Meditation)
Blog.belongsTo(Psychologist, { foreignKey: "created_by", as: "creator" });
Blog.belongsTo(Psychologist, { foreignKey: "updated_by", as: "updater" });
Psychologist.hasMany(Blog, { foreignKey: "created_by", as: "createdBlogs" });
Psychologist.hasMany(Blog, { foreignKey: "updated_by", as: "updatedBlogs" });

Article.belongsTo(Psychologist, { foreignKey: "created_by", as: "creator" });
Article.belongsTo(Psychologist, { foreignKey: "updated_by", as: "updater" });
Psychologist.hasMany(Article, {
  foreignKey: "created_by",
  as: "createdArticles",
});
Psychologist.hasMany(Article, {
  foreignKey: "updated_by",
  as: "updatedArticles",
});

Meditation.belongsTo(Psychologist, { foreignKey: "created_by", as: "creator" });
Meditation.belongsTo(Psychologist, { foreignKey: "updated_by", as: "updater" });
Psychologist.hasMany(Meditation, {
  foreignKey: "created_by",
  as: "createdMeditations",
});
Psychologist.hasMany(Meditation, {
  foreignKey: "updated_by",
  as: "updatedMeditations",
});

// Favorite İlişkileri (İçeriklerle)
Favorite.belongsTo(Blog, { foreignKey: "blog_id" });
Blog.hasMany(Favorite, { foreignKey: "blog_id" });

Favorite.belongsTo(Article, { foreignKey: "article_id" });
Article.hasMany(Favorite, { foreignKey: "article_id" });

Favorite.belongsTo(Meditation, { foreignKey: "meditation_id" });
Meditation.hasMany(Favorite, { foreignKey: "meditation_id" });

// RefreshToken İlişkileri
RefreshToken.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(RefreshToken, { foreignKey: "client_id" });
RefreshToken.belongsTo(Psychologist, { foreignKey: "psychologist_id" });
Psychologist.hasMany(RefreshToken, { foreignKey: "psychologist_id" });
RefreshToken.belongsTo(Staff, { foreignKey: "staff_id" });
Staff.hasMany(RefreshToken, { foreignKey: "staff_id" });

// Log İlişkileri
Log.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(Log, { foreignKey: "client_id" });
Log.belongsTo(Psychologist, { foreignKey: "psychologist_id" });
Psychologist.hasMany(Log, { foreignKey: "psychologist_id" });
Log.belongsTo(Staff, { foreignKey: "staff_id" });
Staff.hasMany(Log, { foreignKey: "staff_id" });

// Staff - Restrictions İlişkisi
Staff.belongsTo(Restrictions, { foreignKey: "restrictions_id" });
Restrictions.hasMany(Staff, { foreignKey: "restrictions_id" });

// Psikolog Onay İlişkisi
Psychologist.belongsTo(Staff, { foreignKey: "approve_by", as: "approver" });
Staff.hasMany(Psychologist, {
  foreignKey: "approve_by",
  as: "approvedPsychologists",
});

// Staff Audit İlişkileri
Staff.belongsTo(Staff, { foreignKey: "created_by", as: "creator" });
Staff.belongsTo(Staff, { foreignKey: "updated_by", as: "updater" });
Staff.hasMany(Staff, { foreignKey: "created_by", as: "createdStaff" });
Staff.hasMany(Staff, { foreignKey: "updated_by", as: "updatedStaff" });

// Restrictions Audit İlişkileri
Restrictions.belongsTo(Staff, { foreignKey: "created_by", as: "creator" });
Restrictions.belongsTo(Staff, { foreignKey: "updated_by", as: "updater" });
Staff.hasMany(Restrictions, {
  foreignKey: "created_by",
  as: "createdRestrictions",
});
Staff.hasMany(Restrictions, {
  foreignKey: "updated_by",
  as: "updatedRestrictions",
});

// Journal Audit İlişkileri
Journal.belongsTo(Client, { foreignKey: "created_by", as: "creator" });
Journal.belongsTo(Client, { foreignKey: "updated_by", as: "updater" });

// Reminder Audit İlişkileri
Reminder.belongsTo(Client, { foreignKey: "created_by", as: "creator" });
Reminder.belongsTo(Client, { foreignKey: "updated_by", as: "updater" });

module.exports = {
  Client,
  Psychologist,
  Package,
  Payment,
  WorkingArea,
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

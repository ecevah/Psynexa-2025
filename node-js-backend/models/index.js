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
const Series = require("./Series");
const SeriesContent = require("./SeriesContent");
const BreathingExercise = require("./BreathingExercise");
const BreathingExerciseItem = require("./BreathingExerciseItem");
const IterationMeditation = require("./IterationMeditation");
const IterationMeditationItem = require("./IterationMeditationItem");

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
  Series,
  SeriesContent,
  BreathingExercise,
  BreathingExerciseItem,
  IterationMeditation,
  IterationMeditationItem,
};

// İlişkileri kur
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;

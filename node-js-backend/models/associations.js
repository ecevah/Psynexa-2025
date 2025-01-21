const Staff = require("./Staff");
const Restrictions = require("./Restrictions");
const logger = require("../config/logger");
const AssignedTask = require("./AssignedTask");
const Client = require("./Client");
const Psychologist = require("./Psychologist");
const Meditation = require("./Meditation");
const IterationMeditation = require("./IterationMeditation");
const BreathingExercise = require("./BreathingExercise");
const Blog = require("./Blog");
const Article = require("./Article");
const Test = require("./Test");
const AssignedTaskResponse = require("./AssignedTaskResponse");
const IterationMeditationItem = require("./IterationMeditationItem");

// Staff - Restrictions ilişkisi
Staff.belongsTo(Restrictions, {
  foreignKey: "restrictions_id",
  as: "restrictions",
});

Restrictions.hasMany(Staff, {
  foreignKey: "restrictions_id",
  as: "staff",
});

// AssignedTask ilişkileri
AssignedTask.belongsTo(Client, {
  foreignKey: "client_id",
  as: "client",
});

AssignedTask.belongsTo(Psychologist, {
  foreignKey: "psyc_id",
  as: "psychologist",
});

AssignedTask.belongsTo(Meditation, {
  foreignKey: "meditation_id",
  as: "meditation",
});

AssignedTask.belongsTo(IterationMeditation, {
  foreignKey: "iteration_meditation_id",
  as: "iteration_meditation",
});

AssignedTask.belongsTo(BreathingExercise, {
  foreignKey: "breathing_exercise_id",
  as: "breathing_exercise",
});

AssignedTask.belongsTo(Blog, {
  foreignKey: "blog_id",
  as: "blog",
});

AssignedTask.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
});

AssignedTask.belongsTo(Test, {
  foreignKey: "test_id",
  as: "test",
});

AssignedTask.hasMany(AssignedTaskResponse, {
  foreignKey: "assigned_task_id",
  as: "responses",
});

// IterationMeditation ilişkileri
IterationMeditation.hasMany(IterationMeditationItem, {
  foreignKey: "meditation_id",
  as: "items",
  onDelete: "CASCADE",
});

IterationMeditation.belongsTo(Psychologist, {
  foreignKey: "psyc_id",
  as: "psychologist",
});

// IterationMeditationItem ilişkileri
IterationMeditationItem.belongsTo(IterationMeditation, {
  foreignKey: "meditation_id",
  as: "meditation",
});

logger.info("Model ilişkileri yüklendi");

module.exports = {
  Staff,
  Restrictions,
  AssignedTask,
  Client,
  Psychologist,
  Meditation,
  IterationMeditation,
  BreathingExercise,
  Blog,
  Article,
  Test,
  AssignedTaskResponse,
  IterationMeditationItem,
};

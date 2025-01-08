const Client = require("./Client");
const Psychologist = require("./Psychologist");
const Package = require("./Package");
const Payment = require("./Payment");
const WorkingArea = require("./WorkingArea");
const RefreshToken = require("./RefreshToken");
const Log = require("./Log");

// İlişkileri tanımla
Client.belongsTo(Psychologist, { foreignKey: "psyc_id" });
Psychologist.hasMany(Client, { foreignKey: "psyc_id" });

Client.belongsTo(Package, { foreignKey: "package_id" });
Package.hasMany(Client, { foreignKey: "package_id" });

Payment.belongsTo(Client, { foreignKey: "client_id" });
Client.hasMany(Payment, { foreignKey: "client_id" });

Payment.belongsTo(Package, { foreignKey: "package_id" });
Package.hasMany(Payment, { foreignKey: "package_id" });

WorkingArea.belongsTo(Psychologist, { foreignKey: "psychologist_id" });
Psychologist.hasMany(WorkingArea, { foreignKey: "psychologist_id" });

module.exports = {
  Client,
  Psychologist,
  Package,
  Payment,
  WorkingArea,
  RefreshToken,
  Log,
};

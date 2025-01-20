const Staff = require("./Staff");
const Restrictions = require("./Restrictions");
const logger = require("../config/logger");

// Staff - Restrictions ilişkisi
Staff.belongsTo(Restrictions, {
  foreignKey: "restrictions_id",
  as: "restrictions",
});

Restrictions.hasMany(Staff, {
  foreignKey: "restrictions_id",
  as: "staff",
});

logger.info("Model ilişkileri yüklendi");

module.exports = {
  Staff,
  Restrictions,
};

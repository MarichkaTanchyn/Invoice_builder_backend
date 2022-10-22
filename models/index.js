const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = require("./employee");
db.role = require("./role");
db.company = require("./company");
db.person = require("./person");

db.role.belongsToMany(db.employee, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.employee.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.employee.belongsTo(db.person);
db.person.hasOne(db.employee);

db.company.hasMany(db.person);
db.person.belongsTo(db.company);

db.ROLES = ["user", "admin"];//TODO: change to different
module.exports = db;
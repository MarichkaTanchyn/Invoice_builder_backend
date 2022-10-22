const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = require("./employee");
db.role = require("./role");
db.company = require("./company");
db.person = require("./person");
db.customer = require('./customer');

db.role.belongsToMany(db.employee, {
    through: "employee_roles",
    foreignKey: "roleId",
    otherKey: "employeeId"
});
db.employee.belongsToMany(db.role, {
    through: "employee_roles",
    foreignKey: "employeeId",
    otherKey: "roleId"
});

db.employee.belongsTo(db.person);
db.person.hasOne(db.employee);

db.company.hasMany(db.person);
db.person.belongsTo(db.company);

db.company.belongsToMany(db.customer, {
    through: "company_customers",
    foreignKey: "companyId",
    otherKey: "customerId"
});
db.customer.belongsToMany(db.company,{
    through: "company_customers",
    foreignKey: "customerId",
    otherKey: "companyId"
});

db.person.hasMany(db.customer);
db.customer.belongsTo(db.customer);

db.ROLES = ["user", "admin"];//TODO: change to different
module.exports = db;
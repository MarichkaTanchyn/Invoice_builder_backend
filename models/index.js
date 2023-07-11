const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = require("./employee");
db.permission = require("./permission");
db.company = require("./company");
db.person = require("./person");
db.customer = require('./customer');
db.invoice = require('./invoice');
db.category = require('./category');
db.product = require('./product');
db.session = require('./session');
db.invitation = require('./invitation');
db.invoiceProducts = require('./invoiceProducts');

// Customer & Invoice
db.customer.hasMany(db.invoice, {onDelete: 'CASCADE', hooks: true});
db.invoice.belongsTo(db.customer);


// COMPANY & INVITATION
db.company.hasMany(db.invitation, {onDelete: 'CASCADE', hooks: true});
db.invitation.belongsTo(db.company);

// session & employee
db.session.belongsTo(db.employee);
db.employee.hasMany(db.session);

// ROLE & EMPLOYEE
db.permission.belongsToMany(db.employee, {
    through: "EmployeePermissions",
    primaryKey: "roleId",
    foreignKey: "roleId",
    otherKey: "employeeId",
    onDelete: "cascade",
    hooks: true
});
db.employee.belongsToMany(db.permission, {
    through: "EmployeePermissions",
    primaryKey: "employeeId",
    foreignKey: "employeeId",
    otherKey: "roleId",
    onDelete: "cascade",
    hooks: true
});

//COMPANY & INVOICE
db.company.hasMany(db.invoice, {onDelete: 'CASCADE', hooks: true});
db.invoice.belongsTo(db.company);


// COMPANY & PERSON
db.company.hasMany(db.person, {onDelete: 'CASCADE', hooks: true});
db.person.belongsTo(db.company);

// EMPLOYEE & PERSON
db.person.hasOne(db.employee, {onDelete: 'CASCADE', hooks: true});
db.employee.belongsTo(db.person);

// PERSON & CUSTOMER
db.person.hasMany(db.customer, {onDelete: 'CASCADE', hooks: true});
db.customer.belongsTo(db.person);

// COMPANY & CUSTOMER
db.company.hasMany(db.customer, {onDelete: 'CASCADE', hooks: true});
db.customer.belongsTo(db.company);

// CATEGORY TO CATEGORY
db.category.hasMany(db.category, { as: 'subCategories', foreignKey: 'parentId' });
db.category.belongsTo(db.category, { as: 'parent', foreignKey: 'parentId' });

// CATEGORY & COMPANY
db.company.hasMany(db.category, {onDelete: 'CASCADE', hooks: true});
db.category.belongsTo(db.company);

//CATEGORY & PRODUCT
db.category.hasMany(db.product, {onDelete: 'CASCADE', hooks: true});
db.product.belongsTo(db.category);

// INVOICE & EMPLOYEE
db.employee.hasMany(db.invoice, {onDelete: 'CASCADE', hooks: true});
db.invoice.belongsTo(db.employee);

// INVOICE & PRODUCT
db.invoice.belongsToMany(db.product, {
    through: db.invoiceProducts,
    primaryKey: "invoiceId",
    foreignKey: "invoiceId",
    otherKey: "productId",
    onDelete: "cascade",
    hooks: true
})
db.product.belongsToMany(db.invoice, {
    through: db.invoiceProducts,
    foreignKey: "productId",
    primaryKey: "productId",
    otherKey: "invoiceId",
    onDelete: "cascade",
    hooks: true
},)

db.PERMISSONS = ["user", "admin"];//TODO: change to different
module.exports = db;
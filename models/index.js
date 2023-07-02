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
db.invoiceDraft = require('./invoiceDraft');
db.category = require('./category');
db.product = require('./product');
db.session = require('./session');
db.invitation = require('./invitation');

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

//COMPANY & INVOICE DRAFT
db.company.hasMany(db.invoiceDraft, {onDelete: 'CASCADE', hooks: true});
db.invoiceDraft.belongsTo(db.company);

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
db.company.belongsToMany(db.customer, {
    through: "company_customers",
    foreignKey: "companyId",
    otherKey: "customerId",
    onDelete: "cascade",
    hooks: true
});
db.customer.belongsToMany(db.company, {
    through: "company_customers",
    foreignKey: "customerId",
    otherKey: "companyId",
    onDelete: "cascade",
    hooks: true
});

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
    through: "invoice_products",
    foreignKey: "invoiceId",
    otherKey: "productId",
    onDelete: "cascade",
    hooks: true
})
db.product.belongsToMany(db.invoice, {
    through: "invoice_products",
    foreignKey: "productId",
    otherKey: "invoiceId",
    onDelete: "cascade",
    hooks: true
},)

// INVOICE DRAFT & EMPLOYEE
db.employee.hasMany(db.invoiceDraft, {onDelete: 'CASCADE', hooks: true});
db.invoiceDraft.belongsTo(db.employee);

//INVOICE DRAFT & PRODUCT
db.invoiceDraft.belongsToMany(db.product, {
    through: "invoiceDraft_products",
    foreignKey: "invoiceDraftId",
    otherKey: "productId",
    onDelete: "cascade",
    hooks: true
})
db.product.belongsToMany(db.invoice, {
    through: "invoiceDraft_products",
    foreignKey: "productId",
    otherKey: "invoiceDraftId",
    onDelete: "cascade",
    hooks: true
})


db.PERMISSONS = ["user", "admin"];//TODO: change to different
module.exports = db;
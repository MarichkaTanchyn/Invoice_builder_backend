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
db.invoice = require('./invoiceOrQuote');
db.invoiceDraft = require('./invoiceOrQuoteDraft');
db.category = require('./category');
db.product = require('./product');

// ROLE & EMPLOYEE
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

// COMPANY & PERSON
db.company.hasMany(db.person);
db.person.belongsTo(db.company);

// EMPLOYEE & PERSON
db.employee.belongsTo(db.person);
db.person.hasOne(db.employee);

// PERSON & CUSTOMER
db.person.hasMany(db.customer);
db.customer.belongsTo(db.person);

// COMPANY & CUSTOMER
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

// CATEGORY TO CATEGORY
db.category.hasMany(db.category);
db.category.hasOne(db.category);

// CATEGORY & COMPANY
db.company.hasMany(db.category);
db.category.belongsTo(db.company);

//CATEGORY & PRODUCT
db.product.hasOne(db.category);
db.category.hasMany(db.product);


// INVOICE & EMPLOYEE
db.employee.hasMany(db.invoice);
db.invoice.hasOne(db.employee);

// INVOICE & PRODUCT
db.invoice.belongsToMany(db.product, {
    through: "invoice_products",
    foreignKey: "invoiceId",
    otherKey: "productId"
})
db.product.belongsToMany(db.invoice, {
    through: "invoice_products",
    foreignKey: "productId",
    otherKey: "invoiceId"
})

// INVOICE DRAFT & EMPLOYEE
db.employee.hasMany(db.invoiceDraft);
db.invoiceDraft.hasOne(db.employee);

//INVOICE DRAFT & PRODUCT
db.invoiceDraft.belongsToMany(db.product, {
    through: "invoiceDraft_products",
    foreignKey: "invoiceDraftId",
    otherKey: "productId"
})
db.product.belongsToMany(db.invoice, {
    through: "invoiceDraft_products",
    foreignKey: "productId",
    otherKey: "invoiceDraftId"
})

//TODO: Invoice, category, product associations

db.ROLES = ["user", "admin"];//TODO: change to different
module.exports = db;
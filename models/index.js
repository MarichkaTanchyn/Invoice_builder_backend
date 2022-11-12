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
    otherKey: "employeeId",
    onDelete: "cascade"
});
db.employee.belongsToMany(db.role, {
    through: "employee_roles",
    foreignKey: "employeeId",
    otherKey: "roleId",
    onDelete: "cascade"
});

// COMPANY & PERSON
db.company.hasMany(db.person, { onDelete: 'cascade' });
db.person.belongsTo(db.company, { onDelete: 'cascade' });

// EMPLOYEE & PERSON
db.employee.belongsTo(db.person, { onDelete: 'cascade' });
db.person.hasOne(db.employee, { onDelete: 'cascade' });

// PERSON & CUSTOMER
db.person.hasMany(db.customer, { onDelete: 'cascade' });
db.customer.belongsTo(db.person, { onDelete: 'cascade' });

// COMPANY & CUSTOMER
db.company.belongsToMany(db.customer, {
    through: "company_customers",
    foreignKey: "companyId",
    otherKey: "customerId",
    onDelete: "cascade"
});
db.customer.belongsToMany(db.company,{
    through: "company_customers",
    foreignKey: "customerId",
    otherKey: "companyId",
    onDelete: "cascade"
});

// CATEGORY TO CATEGORY
db.category.hasMany(db.category, { onDelete: 'cascade' });
db.category.hasOne(db.category, { onDelete: 'cascade' });

// CATEGORY & COMPANY
db.company.hasMany(db.category, { onDelete: 'cascade' });
db.category.belongsTo(db.company, { onDelete: 'cascade' });

//CATEGORY & PRODUCT
db.category.hasMany(db.product, { onDelete: 'cascade' });
db.product.belongsTo(db.category, { onDelete: 'cascade' });

// INVOICE & EMPLOYEE
db.employee.hasMany(db.invoice, { onDelete: 'cascade' });
db.invoice.belongsTo(db.employee, { onDelete: 'cascade' });

// INVOICE & PRODUCT
db.invoice.belongsToMany(db.product, {
    through: "invoice_products",
    foreignKey: "invoiceId",
    otherKey: "productId",
    onDelete: "cascade"
})
db.product.belongsToMany(db.invoice, {
    through: "invoice_products",
    foreignKey: "productId",
    otherKey: "invoiceId",
    onDelete: "cascade"
},)

// INVOICE DRAFT & EMPLOYEE
db.employee.hasMany(db.invoiceDraft, { onDelete: 'cascade' });
db.invoiceDraft.belongsTo(db.employee, { onDelete: 'cascade' });

//INVOICE DRAFT & PRODUCT
db.invoiceDraft.belongsToMany(db.product, {
    through: "invoiceDraft_products",
    foreignKey: "invoiceDraftId",
    otherKey: "productId",
    onDelete: "cascade"
})
db.product.belongsToMany(db.invoice, {
    through: "invoiceDraft_products",
    foreignKey: "productId",
    otherKey: "invoiceDraftId",
    onDelete: "cascade"
})


db.ROLES = ["user", "admin"];//TODO: change to different
module.exports = db;
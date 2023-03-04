const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const InvoiceDraft = sequelize.define('InvoiceDraft', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    invoiceNumber: Sequelize.STRING,
    creationDate: Sequelize.DATE,
    dueDate: Sequelize.DATE,
    validTo: Sequelize.DATE,
    status: Sequelize.STRING,
    typeOfDocument : Sequelize.STRING,
    paymentMethod : Sequelize.STRING,
    bankAccount : Sequelize.STRING,
    currency: Sequelize.STRING,
    paid : Sequelize.BOOLEAN,
    totalAmount: Sequelize.STRING,
});

module.exports = InvoiceDraft;
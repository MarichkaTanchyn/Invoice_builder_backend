const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    documentNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    currency: {
        type: Sequelize.STRING,
        allowNull: false
    },
    paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false
    },
    validFrom: {
        type: Sequelize.DATE,
        allowNull: false
    },
    validTo: {
        type: Sequelize.DATE,
        allowNull: true
    },
    totalAmount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    paidAmount : {
        type: Sequelize.INTEGER
    },
    status: Sequelize.STRING,
    documentType: Sequelize.STRING,
    invoiceFileLink: Sequelize.STRING
});

module.exports = Invoice;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const InvoiceOrQuoteDraft = sequelize.define('InvoiceOrQuoteDraft', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    creationDate: Sequelize.DATE,
    validTo: Sequelize.DATE,
    status: Sequelize.STRING,
    documentNumber: Sequelize.STRING,
    documentName: Sequelize.STRING,
    typeOfDocument : Sequelize.STRING,
    paymentMethod : Sequelize.STRING,
    bankAccount : Sequelize.STRING,
    currency: Sequelize.STRING,
    paid : Sequelize.BOOLEAN
});

module.exports = InvoiceOrQuoteDraft;
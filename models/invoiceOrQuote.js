const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const InvoiceOrQuote = sequelize.define('InvoiceOrQuote', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    documentNumber:{
        type: Sequelize.STRING,
        allowNull: false
    },
    documentName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    creationDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    validTo: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: Sequelize.STRING,
    typeOfDocument : Sequelize.STRING,
    invoiceFile : Sequelize.BLOB
});

module.exports = InvoiceOrQuote;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const InvoiceOrQuote = sequelize.define('InvoiceOrQuote', {
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
    //file
});

module.exports = InvoiceOrQuote;
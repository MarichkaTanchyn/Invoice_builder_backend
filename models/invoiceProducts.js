const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const InvoiceProducts = sequelize.define("InvoiceProducts", {
    amount : {
        type: Sequelize.INTEGER,
        allowNull: false

    },
    unit: {
        type: Sequelize.STRING,
        allowNull: true
    },
    discount: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    tax: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = InvoiceProducts;
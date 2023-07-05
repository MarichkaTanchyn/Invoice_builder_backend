const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Customer = sequelize.define('Customer',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    companyNumber:  {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    postalCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nip: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.STRING,
    }
});

module.exports = Customer;
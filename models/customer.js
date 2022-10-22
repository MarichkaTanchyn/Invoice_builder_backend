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
    address: Sequelize.STRING,
    country: Sequelize.STRING,
    city: Sequelize.STRING,
    postalCode: Sequelize.INTEGER,
    nip: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = Customer;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Company = sequelize.define('Company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    country: Sequelize.STRING,
    city: Sequelize.STRING,
    postalCode: Sequelize.INTEGER,
    nip: Sequelize.INTEGER
});

module.exports = Company;
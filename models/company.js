const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Company = sequelize.define('Company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firmName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address:{
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    postalCode:{
        type: Sequelize.STRING,
        allowNull: true
    },
    nip: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
});

module.exports = Company;
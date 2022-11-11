const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Company = sequelize.define('Company', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address:{
        type: Sequelize.STRING,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    postalCode:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nip: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = Company;
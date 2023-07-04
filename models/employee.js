const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Employee = sequelize.define("Employee", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    accepted: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = Employee;
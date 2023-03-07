const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmployeePermission = sequelize.define("EmployeePermission", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeId: {
        type: Sequelize.INTEGER,
    }
});

module.exports = EmployeePermission;
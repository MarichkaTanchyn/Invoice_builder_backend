const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Employee = require("./employee");

const Role = sequelize.define("roles", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    }
});

module.exports = Role;
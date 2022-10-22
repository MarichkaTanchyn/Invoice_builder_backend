const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Role = sequelize.define("Role", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    }
});

module.exports = Role;
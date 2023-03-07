const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Permission = sequelize.define("Permission", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    }
});

module.exports = Permission;
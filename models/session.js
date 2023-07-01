const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Session = sequelize.define("Session", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false

    },
    lastAccess: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = Session;
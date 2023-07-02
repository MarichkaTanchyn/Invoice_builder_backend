const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Invitation = sequelize.define('Invitation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Invitation;
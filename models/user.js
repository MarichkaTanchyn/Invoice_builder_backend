const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    firmName: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});


module.exports = User;
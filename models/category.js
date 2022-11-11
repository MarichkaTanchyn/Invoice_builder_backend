const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Category = sequelize.define('Category', {
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
    description: Sequelize.STRING,
});

module.exports = Category;
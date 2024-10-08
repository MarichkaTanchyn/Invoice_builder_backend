const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Person = sequelize.define("Person", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    lastName:  {
        type: Sequelize.STRING,
        allowNull: true
    },
    middleName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email:  {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber:  {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Person;
const Sequelize = require('sequelize');

const sequelize = new Sequelize('excelTry', 'maria', 'sa', {
    dialect: 'postgres',
    host: 'localhost',
});

module.exports = sequelize;

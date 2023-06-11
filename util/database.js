const Sequelize = require('sequelize');

const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize('excelTry', 'maria', 'sa', {
    dialect: 'postgres',
    host: host,
});

module.exports = sequelize;

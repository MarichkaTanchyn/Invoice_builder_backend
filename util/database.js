const Sequelize = require('sequelize');

const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_LOGIN, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: host,
});

module.exports = sequelize;

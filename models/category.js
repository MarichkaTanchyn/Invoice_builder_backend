// module.exports = (sequelize, Sequelize) => {
//     const Category = sequelize.define("categories", {
//         name: {
//             type: Sequelize.STRING
//         },
//         description: {
//             type: Sequelize.STRING
//         },
//         imageUrl: {
//             type: Sequelize.STRING
//         }
//     });
//     return Category;
// };

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    imageUrl: Sequelize.STRING
});

module.exports = Category;
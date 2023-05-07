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
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Categories', // Note that the table name is usually pluralized by Sequelize
            key: 'id'
        },
        onDelete: 'CASCADE', // Optional: CASCADE will delete subcategories when a parent is deleted
        onUpdate: 'CASCADE'  // Optional: CASCADE will update subcategories when a parent is updated
    }
});

module.exports = Category;
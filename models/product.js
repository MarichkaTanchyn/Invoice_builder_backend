const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("Product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nameColumnName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: true,
  },
  priceColumnName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  descriptionColumnName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  other: Sequelize.JSONB,
});

module.exports = Product;

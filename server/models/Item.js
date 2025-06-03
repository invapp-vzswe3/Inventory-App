const { DataTypes, Model, Sequelize} = require("sequelize");
const sequelize = require("../db");

class Item extends Model {}

Item.init(
  {
 name: {
      type: Sequelize.STRING,// Define your columns here
      allowNull: false
  },
  
  description: Sequelize.TEXT,
  price: {
      type: Sequelize.INTEGER,
      allowNull: false
  },
  category: Sequelize.STRING,
    image: Sequelize.STRING,
  },
  {
    sequelize,
    modelName: 'Item',
  }
);

module.exports = Item;

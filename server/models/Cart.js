const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Cart extends Model {}

Cart.init({
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: "Cart",
});

module.exports = Cart;

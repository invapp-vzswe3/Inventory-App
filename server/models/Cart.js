const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Item = require("./Item");

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

// Associations
Cart.belongsTo(User);
Cart.belongsTo(Item);
User.hasMany(Cart);
Item.hasMany(Cart);

module.exports = Cart;

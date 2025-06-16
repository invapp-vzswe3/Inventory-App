const Item = require("./Item");
const User = require("./User");
const Order = require("./Order");
const Cart = require("./Cart");

Order.belongsTo(User);
User.hasMany(Order);

Cart.belongsTo(User);
Cart.belongsTo(Item);
User.hasMany(Cart);
Item.hasMany(Cart);

module.exports = {
  Item,
  User,
  Order,
  Cart
};

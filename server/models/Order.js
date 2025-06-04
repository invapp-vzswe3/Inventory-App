const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

class Order extends Model {}

Order.init(
  {
    total: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Delivered"),
      defaultValue: "Pending",
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
);

// Associations
Order.belongsTo(User);
User.hasMany(Order);

module.exports = Order;

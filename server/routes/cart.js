const express = require("express");
const { Cart, Item, User } = require("../models");
const router = express.Router();

// Add item to cart
router.post("/", async (req, res) => {
  const { userId, itemId, quantity } = req.body;
  const cartItem = await Cart.create({ userId, itemId, quantity });
  res.status(201).json(cartItem);
});

// Get all items in user's cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findAll({
    where: { userId: req.params.userId },
    include: Item
  });
  res.json(cart);
});

// Delete item from cart
router.delete("/:id", async (req, res) => {
  await Cart.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;

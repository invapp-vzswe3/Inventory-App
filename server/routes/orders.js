const express = require("express");
const { Order, User } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.findAll({ include: User });
  res.json(orders);
});

module.exports = router;

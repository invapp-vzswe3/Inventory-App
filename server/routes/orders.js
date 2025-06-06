const express = require("express");
const { Order, User } = require("../models");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err)
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: User });
    res.json(orders);
  } catch(err) {
    next(err);
  }
});

module.exports = router;

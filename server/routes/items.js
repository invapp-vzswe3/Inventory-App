const express = require("express");
const { Item } = require("../models");

const router = express.Router();
router.use(express.json());

// Define your routes here
router.get("/:id", async (req, res) => {
    try{
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
})

// GET /items
router.get('/', async (req, res, next) => {
  try {
    const items = await Item.findAll()
    res.send(items)
  } catch (error) {
    next(error)
  }
})
router.post('/', async (req, res, next) => {
  try {
    const { name, price, description, category, image } = req.body;
    const newItem = await Item.create({ name, price, description, category, image });
    res.status(201).json(newItem); 
  } catch (error) {
    next(error);
  }
});
module.exports = router;

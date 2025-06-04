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

// UPDATE Item
router.put("/:id", async (req, res, next) => {
  try {
    const foundItem = await Item.findByPk(req.params.id);
    if (!foundItem) {
      res.status(400).json({ error: `Item not found ID: ${req.params.id}`});
    } else {
      const updatedItem = await foundItem.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,

      });
      console.log(updatedItem);
      res.status(200).json(updatedItem);
    }
  } catch(err) {
    next(err);
  }
})

module.exports = router;

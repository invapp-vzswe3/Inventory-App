const express = require("express");
const { Item } = require("../models");
const { Op } = require("sequelize");

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
    let where = {};
    if (req.query.name) {
      where.name = { [Op.like]: `%${req.query.name}%` };
    }
    const items = await Item.findAll({ where: Object.keys(where).length ? where : undefined });
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

// DELETE /items/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await Item.destroy({
      where: { id: req.params.id }
    })
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
      return res.status(500).json({ error: "Server Error" });
  }
})

module.exports = router;

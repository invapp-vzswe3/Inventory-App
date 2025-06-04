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

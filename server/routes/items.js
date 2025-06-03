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

module.exports = router;

const express = require("express");
const router = express.Router();

// different model routers
router.use("/items", require("./items"));
router.use("/users", require("./users"));
router.use("/orders", require("./orders"));
router.use("/cart", require("./cart"));

module.exports = router;

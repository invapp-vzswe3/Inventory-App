const express = require("express");
const { User } = require("../models");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      res.status(400).json({ error: `Could not find user`});
    } else {
      res.status(201).json(user);
    }

  } catch (err) {
    next(err);

  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    if (!users) {
      res.status(400).json({ error: `Could not find users`});
    } else {
      res.status(200).json(users);
    }

  } catch(err) {
    next(err);
    
  }

});

module.exports = router;

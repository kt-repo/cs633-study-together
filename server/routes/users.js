var express = require('express');
const Meetup = require("../models/meetup");
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    school: req.body.school,
    favorites: req.body.favorites,
  })

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})


module.exports = router;

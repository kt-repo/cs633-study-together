var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Meetup = require("../models/meetup");
const User = require('../models/user');
const verifyToken = require('../auth/authMiddleware');

var router = express.Router();

/* User registration, login */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    const userId = user._id;
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.status(201).json({ token, userId });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    const validPassword = await user.comparePassword(password);
    if (!validPassword) return res.status(401).send('Invalid password');
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    const userId = user._id;
    res.status(200).json({ token, userId });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, 'secret_key');
    const user = await User.findById(payload.userId);
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
});

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

// DELETE user by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});


module.exports = router;

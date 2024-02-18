var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const Meetup = require('../models/meetup');
const User = require('../models/user');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded file
    }
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', async (req, res) => {
    try {
        const meetups = await Meetup.find();
        res.json(meetups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const meetup = new Meetup({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
    });

    try {
        const newMeetup = await meetup.save();
        res.status(201).json(newMeetup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


module.exports = router;

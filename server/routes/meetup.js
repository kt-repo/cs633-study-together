var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const Meetup = require('../models/meetup');
const User = require('../models/user');
const verifyToken = require('../auth/authMiddleware');

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

router.post('/', verifyToken, async (req, res) => {
    const meetup = new Meetup({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        owner: req.body.owner
    });

    try {
        const newMeetup = await meetup.save();
        res.status(201).json(newMeetup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Delete Meetup
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const meetupId = req.params.id;
        const meetup = await Meetup.findById(meetupId);
        console.log(meetupId);

        // Check if the meetup exists
        if (!meetup) {
            return res.status(404).json({ message: 'Meetup not found' });
        }

        // Check if the user requesting deletion is the owner of the meetup
        if (meetup.owner.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this meetup' });
        }

        // Find the user by ID and delete it
        const deletedMeetup = await Meetup.findByIdAndDelete(meetupId);

        // Check if the user exists
        if (!deletedMeetup) {
            return res.status(404).json({ message: 'Meetup not found' });
        }

        res.json({ message: 'Meetup deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting meetup' });
    }

});

module.exports = router;

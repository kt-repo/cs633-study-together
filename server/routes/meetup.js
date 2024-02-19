var express = require('express');
var router = express.Router();
const path = require('path');
const Meetup = require('../models/meetup');
const User = require('../models/user');
const verifyToken = require('../auth/authMiddleware');

/* GET users listing. */
router.get('/', async (req, res) => {
    try {
        const meetups = await Meetup.find();
        console.log('hey');
        console.log(meetups);
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

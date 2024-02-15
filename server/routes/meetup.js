var express = require('express');
var router = express.Router();
const Meetup = require('../models/meetup');
const User = require('../models/user');

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
        image: req.body.image,
    })

    console.log(meetup);

    try {
        const newMeetup = await meetup.save();
        res.status(201).json(newMeetup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


module.exports = router;

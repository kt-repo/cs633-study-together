const mongoose = require('mongoose');

const meetupSchema = mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Meetup', meetupSchema);

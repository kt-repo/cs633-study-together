const mongoose = require('mongoose');
const meetupSchema = require('./meetup');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    favorites: {
        type: meetupSchema.schema,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const meetupSchema = require('./meetup');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    firstname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meetup',
        required: false,
    }],
    address: {
        type: String,
        required: false,
    },
    school: {
        type: String,
        required: false,
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
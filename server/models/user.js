const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const meetupSchema = require('./meetup');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
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
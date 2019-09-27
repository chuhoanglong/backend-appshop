const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String
});

var user = mongoose.model('users', userSchema);

module.exports = user;
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    salt: String,
    token: String,
    wishlist: Array,
    language: String
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
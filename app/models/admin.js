var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var AdminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

module.exports = mongoose.model('Admin', AdminSchema);
var mongoose = require('mongoose');

var Class = require('./class.js');

var StudentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: String,
    firstName: String,
    lastName: String,
    google: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    classes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Class'} ]
})

module.exports = mongoose.model('Student', StudentSchema);
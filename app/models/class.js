var mongoose = require('mongoose');
var Professor = require('./professor.js');
var Student = require('./student.js');

var ClassSchema = new mongoose.Schema({
    _id: Number,
    course: {
        code: String,
        name: String,
        units: Number
    },
    section: String,
    schedule: {
        day: String,
        time: String,
        room: String
    },
    professor: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor'}
})

module.exports = mongoose.model('Class', ClassSchema);
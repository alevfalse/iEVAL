var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var AdminSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

AdminSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(rounds));
}

AdminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);
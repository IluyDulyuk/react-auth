const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, requared: true},
    password: {type: String, requared: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model('User', UserSchema);

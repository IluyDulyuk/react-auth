const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refrechToken: {type: String, requared: true},
})

module.exports = model('Token', TokenSchema);

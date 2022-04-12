const {Schema, model} = require('mongoose');

const User = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    userstocks: [{type: Schema.Types.ObjectId, ref: 'UserStock'}],
    balance: {type: Number, default: 0},
})

module.exports = model('User', User);
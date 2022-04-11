const {Schema, model} = require('mongoose');

const User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userstocks: [{type: Schema.Types.ObjectId, ref: 'UserStock'}],
})

module.exports = model('User', User);
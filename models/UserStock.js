const {Schema, model} = require('mongoose');

const UserStock = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    stock: {type: Schema.Types.ObjectId, ref: 'Stock'},
})

module.exports = model('UserStock', UserStock);
const {Schema, model} = require('mongoose');

const UserStock = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    symbol: {type: String, required: true}, // AAPL
    name: {type: String, required: true}, // Apple Inc.
    price_at_buy: {type: Number, required: true},
})

module.exports = model('UserStock', UserStock);
const {Schema, model} = require('mongoose');

const UserStock = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    symbol: {type: String, required: true}, // AAPL
    price_at_buy: {type: Number, required: true},
})

module.exports = model('UserStock', UserStock);
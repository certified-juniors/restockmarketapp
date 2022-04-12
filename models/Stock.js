const {Schema, model} = require('mongoose');

const Stock = new Schema({
    name: {type: String, required: true},
    cur_price: {type: Number, required: true},
    last_price: {type: Number, required: true},
})

module.exports = model('Stock', Stock);

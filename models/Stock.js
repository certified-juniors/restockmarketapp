const {Schema, model} = require('mongoose');

const Stock = new Schema({
    name: {type: String, required: true},
})

module.exports = model('Stock', Stock);
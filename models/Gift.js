const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    description: { type: String },
})

module.exports = mongoose.model('Gift', giftSchema);
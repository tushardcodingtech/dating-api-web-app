const mongose = require('mongoose');

const giftSchema = new mongose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
})

module.exports = mongose.model('Gift', giftSchema);
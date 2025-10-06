const mongose = require('mongoose');

const giftSchema = new mongose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    description: { type: String },
})

module.exports = mongoose.model('Gift', giftSchema);
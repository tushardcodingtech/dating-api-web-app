const mongoose = require("mongoose");

const userGiftSchema = new mongoose.Schema({
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift" },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "sent" },
}, { timestamps: true });

module.exports = mongoose.model("UserGift", userGiftSchema);
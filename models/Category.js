const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  icon: String,
  title: { type: String, required: true },
  tagline: String,
  desc: String,
  gradient: String,
  image: String,
  interests: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);

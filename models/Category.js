const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String },
  desc: { type: String },
  gradient: { type: String },
  image: { type: String },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

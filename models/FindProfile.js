const mongoose = require('mongoose');

const findProfileSchema = new mongoose.Schema({
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old'],
    max: [120, 'Age must be reasonable']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    trim: true
  },
  image: {
    type: String, 
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('FindProfile', findProfileSchema);
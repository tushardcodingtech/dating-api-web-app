const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  
      socketTimeoutMS: 45000,        
      family: 4                       
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Connection URI:', process.env.MONGODB_URI);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

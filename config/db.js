const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.DATABASE_URL ? 'Found' : 'Missing');
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,  
      socketTimeoutMS: 45000,        
      family: 4                       
    });
    console.log('MongoDB Connected...');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Failed to connect to MongoDB');
    throw err;
  }
};
// Add event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = connectDB;

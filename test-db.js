require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI);

// Event handlers for connection events
mongoose.connection.on('connecting', () => {
  console.log('MongoDB: Attempting to connect...');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB: Successfully connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB: Disconnected');
});

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      family: 4
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      errorLabels: error.errorLabels
    });
    
    // Additional troubleshooting steps
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Check if the MongoDB service is running in Windows Services');
    console.log('3. Try connecting to MongoDB using MongoDB Compass with the same connection string');
    console.log('4. Verify that your firewall is not blocking port 27017');
    
    process.exit(1);
  }
};

// Start the test
testConnection();

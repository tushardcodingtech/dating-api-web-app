require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Database connection
const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dating-app';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB Atlas'))
.catch(err => console.error(' MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to database:', db.name));

app.use(express.json())

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.json());

// -------------------------
// MongoDB connection
// -------------------------
const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dating-app';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
// -------------------------
// Express test route
// -------------------------
app.get('/', (req, res) => {
  res.send('Server and WebSocket are running!');
});

// -------------------------
// Start Express server
// -------------------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// -------------------------
// WebSocket setup
// -------------------------
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// -------------------------
// Make WebSocket available to routes
// -------------------------
app.use((req, res, next) => {
  req.wss = wss; // <-- attach to request
  next();
});

// -------------------------
// Import & use routes
// -------------------------
const giftRoutes = require('./routes/gift');
app.use('/api/gifts', giftRoutes);

module.exports = { wss };

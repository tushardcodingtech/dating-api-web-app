require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.json());

// MongoDB connection
const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dating-app';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Express basic route (for testing)
app.get('/', (req, res) => {
  res.send('Server and WebSocket are running!');
});

// Start Express server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// -------------------------
// WebSocket Integration
// -------------------------
const wss = new WebSocketServer({ server }); // attach to same HTTP server

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // When client sends a message
  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // On disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

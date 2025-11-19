const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  getUserChats,
} = require("../controllers/matchController");

// Send request
router.post("/send", auth, sendRequest);

// Get incoming requests
router.get("/incoming", auth, getRequests);

// Accept request
router.post("/accept", auth, acceptRequest);

// Reject request
router.post("/reject", auth, rejectRequest);

// Route to get user chats
router.get("/chats", auth, getUserChats);

// Routes for chat functionality
router.get("/chats/:chatId", auth, getChatById);

// Send message in a chat
router.post("/chats/:chatId/message", auth, sendMessage);

module.exports = router;

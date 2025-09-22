// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Match = require("../models/Match");
const auth = require("../middleware/auth");

// Send a message
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    const message = new Message({
      sender: req.user.userId,
      receiver: req.body.receiverId,
      text: req.body.text
     });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});

// Get messages for a match
router.get("/match/:matchId", auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Find the "other" user in the match
    const otherUserId = match.users.find(
      (u) => u.toString() !== req.user.userId
    );

    if (!otherUserId) {
      return res.status(400).json({ message: "No other user found in match" });
    }

    // Fetch messages between logged-in user and other user
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

module.exports = router;


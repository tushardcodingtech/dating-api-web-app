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
    const { matchId } = req.params;
    const currentUserId = req.user.userId?.toString();

    // 1) Find the match and ensure current user is a participant
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const usersInMatch = match.users.map((u) => u.toString());
    if (!usersInMatch.includes(currentUserId)) {
      return res.status(403).json({ message: "You are not a participant in this match" });
    }

    // 2) Resolve the other participant
    const otherUserId = usersInMatch.find((u) => u !== currentUserId);

    // 3) Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json({
      matchId,
      participants: {
        me: currentUserId,
        other: otherUserId,
      },
      messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});


module.exports = router;

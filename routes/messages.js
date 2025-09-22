// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Match = require("../models/Match");
const auth = require("../middleware/auth");

// Send a message
router.post("/", auth, async (req, res) => {
  try {
    const { matchId, text } = req.body;
    if (!matchId || !text) {
      return res.status(400).json({ message: "MatchId and text are required" });
    }
  
    // Find the match
    const match = await Match.findById(matchId).populate("users", "_id name");
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
  
    // Find the other user in this match
    const otherUser = match.users.find(
      (u) => u._id.toString() !== req.user.userId
    );
    if (!otherUser) {
      return res.status(400).json({ message: "Other user not found in match" });
    }
  
    const message = new Message({
      sender: req.user.userId,
      receiver: otherUser._id,     
      text
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
    const match = await Match.findById(req.params.matchId).populate("users", "_id name");
     if (!match) {
       return res.status(404).json({ message: "Match not found" });
     }
  
     const otherUser = match.users.find(
       (u) => u._id.toString() !== req.user.userId
     );
     if (!otherUser) {
       return res.status(400).json({ message: "Other user not found in match" });
     }
  
     const messages = await Message.find({
       $or: [
         { sender: req.user.userId, receiver: otherUser._id },
         { sender: otherUser._id, receiver: req.user.userId }
       ]
     }).sort({ createdAt: 1 });
  
     res.json({
       messages,
       otherUserId: otherUser._id
     });

  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});


module.exports = router;


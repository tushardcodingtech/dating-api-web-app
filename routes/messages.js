// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
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
      receiver: receiverId,
      text
    });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});
router.get("/:userId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: req.params.userId, text: { $exists: true }, createdAt: { $exists: true } },
        { sender: req.params.userId, receiver: req.user.userId, text: { $exists: true }, createdAt: { $exists: true } }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
}); 


module.exports = router;

const express = require("express");
const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
const Message = require("../models/message"); // <-- import Message model
const Match = require("../models/Match");
const router = express.Router();
const authmiddleware = require("../middleware/auth");

// Get all gifts
router.get("/", async (req, res) => {
  const gifts = await Gift.find();
  res.json(gifts);
});

// Send a gift
router.post("/send", authmiddleware, async (req, res) => {
  try {
    const { giftId, receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!giftId || !receiverId) {
      return res.status(400).json({ error: "Gift and receiver are required" });
    }

    // 1️⃣ Validate gift exists
    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Gift not found" });

    // 2️⃣ Save the gift record
    const userGift = await UserGift.create({
      giftId,
      senderId,
      receiverId,
      message,
    });

    // 3️⃣ Find match between sender and receiver (for chat)
    const match = await Match.findOne({
      users: { $all: [senderId, receiverId] }
    });

    if (match) {
      // 4️⃣ Create a chat message entry for this gift
      const chatMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        text: message || `🎁 Sent a gift: ${gift.name}`,
      });
      await chatMessage.save();
    }

    // 5️⃣ WebSocket broadcast (if configured)
    if (req.wss) {
      req.wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            type: "NEW_GIFT",
            data: { giftId, senderId, receiverId, message: message || `🎁 Sent a gift: ${gift.name}` }
          }));
        }
      });
    }

    res.json({ message: "Gift sent successfully!", gift: userGift });
  } catch (error) {
    console.error("Send gift error:", error);
    res.status(500).json({ error: "Failed to send gift" });
  }
});

module.exports = router;

const express = require("express");
const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
const Message = require("../models/message"); // <-- import Message model
const router = express.Router();
const authmiddleware = require("../middleware/auth");

// Get all gifts
router.get("/", async (req, res) => {
  const gifts = await Gift.find();
  res.json(gifts);
});

// Send a gift and create a chat message
router.post("/send", authmiddleware, async (req, res) => {
  try {
    const { giftId, receiverId, message: optionalMessage } = req.body;
    const senderId = req.user.id;

    // Save gift in UserGift
    const userGift = await UserGift.create({
      giftId,
      senderId,
      receiverId,
    });

    // Fetch gift details
    const gift = await Gift.findById(giftId);

    // Create a chat message for this gift
    const chatMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: `🎁 Sent a gift: ${gift.name}${optionalMessage ? " - " + optionalMessage : ""}`,
    });

    res.json({ 
      message: "Gift sent successfully!", 
      gift: userGift, 
      chatMessage 
    });
  } catch (error) {
    console.error("Send gift error:", error);
    res.status(500).json({ error: "Failed to send gift" });
  }
});

module.exports = router;

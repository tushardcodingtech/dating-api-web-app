const express = require("express");
const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
const Message = require("../models/message"); 
const router = express.Router();
const authmiddleware = require("../middleware/auth");

// Get all gifts
router.get("/", async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.json(gifts);
  } catch (err) {
    console.error("Error fetching gifts:", err);
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});

// Send a gift and create a chat message
router.post("/send", authmiddleware, async (req, res) => {
  try {
    const { giftId, receiverId, message: optionalMessage } = req.body;
    const senderId = req.user?.UserId;

    // Validate required fields
    if (!giftId) return res.status(400).json({ error: "giftId is required" });
    if (!receiverId) return res.status(400).json({ error: "receiverId is required" });
    if (!senderId) return res.status(400).json({ error: "senderId not found in auth token" });

    // Check if gift exists
    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Gift not found" });

    //  Save gift in UserGift
    const userGift = await UserGift.create({
      giftId,
      senderId,
      receiverId,
    });

    //  Create a chat message for this gift
    const chatMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: `🎁 Sent a gift: ${gift.name}${optionalMessage ? " - " + optionalMessage : ""}`,
    });

    res.json({
      message: "Gift sent successfully!",
      gift: userGift,
      chatMessage,
    });

  } catch (error) {
    console.error("Send gift error:", error);
    res.status(500).json({ error: error.message || "Failed to send gift" });
  }
});

module.exports = router;

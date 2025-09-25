const express = require("express");
const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
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
    const { giftId, receiverId } = req.body;
    const senderId = req.user.id; 

    const userGift = await UserGift.create({
      giftId,
      senderId,
      receiverId,
    });

    res.json({ message: "Gift sent successfully!", gift: userGift });
  } catch (error) {
    console.error("Send gift error:", error);
    res.status(500).json({ error: "Failed to send gift" });
  }
});

module.exports = router;

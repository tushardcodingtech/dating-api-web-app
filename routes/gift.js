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

    if (!giftId || !receiverId) {
      return res.status(400).json({ error: "Gift and receiver are required" });
    }

    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Gift not found" });

    const userGift = await UserGift.create({ giftId, senderId, receiverId });

    // WebSocket notification
//     if (req.wss) {
//       req.wss.clients.forEach(client => {
//         if (client.readyState === 1) {
//           client.send(JSON.stringify({
//             type: "NEW_GIFT",
//             data: { giftId, senderId, receiverId }
//           }));
//         }
//       });
//     }

//     res.json({ message: "Gift sent successfully!", gift: userGift });
//   } catch (error) {
//     console.error("Send gift error:", error);
//     res.status(500).json({ error: "Failed to send gift" });
//   }
// });


module.exports = router;

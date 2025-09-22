// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Match = require("../models/Match");
const FindProfile = require("../models/FindProfile");

// Get all matches of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user.userId, // find matches where this user is included
    })
      .populate("users", "name") // only get userId + name
      .sort({ createdAt: -1 });

    const result = [];

    for (const match of matches) {
      // find the "other" user in the match
      const otherUser = match.users.find(
        (u) => u._id.toString() !== req.user.userId
      );

      if (!otherUser) continue;

      // get profile from FindProfile
      const profile = await FindProfile.findOne({ userId: otherUser._id });

      result.push({
        _id: match._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          age: profile?.age || null,
          location: profile?.location || null,
          bio: profile?.bio || null,
          image: profile?.image || null,
        },
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get messages for a match
router.get("/match/:matchId", auth, async (req, res) => {
  try {
    // Find the match document
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    // Determine the other user's ID
    const otherUserId = match.users.find(
      (u) => u.toString() !== req.user.userId
    );
    if (!otherUserId) return res.status(404).json({ message: "Other user not found" });

    // Fetch messages with that user
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ messages, otherUserId });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

module.exports = router;

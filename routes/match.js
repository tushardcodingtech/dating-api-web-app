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

// Get match details (other participant's profile) by match ID
router.get("/:matchId", auth, async (req, res) => {
  try {
    const { matchId } = req.params;

    // 1) Find the match by ID
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 2) Verify requester is a participant
    const currentUserId = req.user.userId?.toString();
    const usersInMatch = match.users.map((u) => u.toString());
    if (!usersInMatch.includes(currentUserId)) {
      return res.status(403).json({ message: "You are not a participant in this match" });
    }

    // 3) Determine the other participant
    const otherUserId = usersInMatch.find((u) => u !== currentUserId);
    if (!otherUserId) {
      return res.status(400).json({ message: "Invalid match participants" });
    }

    // 4) Fetch the other user's profile and basic user details
    const otherProfile = await FindProfile.findOne({ userId: otherUserId })
      .populate("userId", "name email");

    if (!otherProfile) {
      return res.status(404).json({ message: "Profile for matched user not found" });
    }

    // 5) Return the matched user's profile details
    res.json({
      _id: otherProfile._id,
      userId: otherProfile.userId._id,
      user: {
        _id: otherProfile.userId._id,
        name: otherProfile.userId.name,
        email: otherProfile.userId.email,
      },
      age: otherProfile.age,
      location: otherProfile.location,
      bio: otherProfile.bio,
      image: otherProfile.image,
      createdAt: otherProfile.createdAt,
    });
  } catch (err) {
    console.error("Error fetching match details:", err);
    res.status(500).json({ message: "Failed to fetch match details", error: err.message });
  }
});

module.exports = router;

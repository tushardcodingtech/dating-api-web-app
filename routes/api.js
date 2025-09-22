const express = require("express");
const router = express.Router();
const FindProfile = require("../models/FindProfile");
const auth = require("../middleware/auth");
const Match = require("../models/Match");

// Create a new profile
router.post("/people", auth, async (req, res) => {
  try {
    // Ensure each user can only create one profile
    const existing = await FindProfile.findOne({ userId: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const person = new FindProfile({
      userId: req.user.userId, // attach logged-in user
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
      image: req.body.image,
    });

    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all profiles except current user's (for finding matches)
router.get("/people", auth, async (req, res) => {
  try {
    const people = await FindProfile.find({
      userId: { $ne: req.user.userId }
    }).populate("userId", "name");
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user's profile
router.get("/profile/me", auth, async (req, res) => {
  try {
    const profile = await FindProfile.findOne({ 
      userId: req.user.userId 
    }).populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update current user's profile
router.put("/profile/me", auth, async (req, res) => {
  try {
    const updatedProfile = await FindProfile.findOneAndUpdate(
      { userId: req.user.userId },  // ensure only user profile updates
      {
        age: req.body.age,
        location: req.body.location,
        bio: req.body.bio,
        image: req.body.image,
      },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Add new route to get match details by ID
router.get("/matches/:matchId", auth, async (req, res) => {
  try {
    const { matchId } = req.params;

    // 1) Find the match by ID
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 2) Ensure the current user is part of the match
    const currentUserId = req.user.userId?.toString();
    const usersInMatch = match.users.map((u) => u.toString());
    if (!usersInMatch.includes(currentUserId)) {
      return res.status(403).json({ message: "You are not a participant in this match" });
    }

    // 3) Determine the other user in the match
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

    // 5) Return the matched user's profile details in a consistent shape
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
    res.status(500).json({ 
      error: "Failed to fetch match details",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;

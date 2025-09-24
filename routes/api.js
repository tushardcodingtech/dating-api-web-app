const express = require("express");
const router = express.Router();
const FindProfile = require("../models/FindProfile");
const auth = require("../middleware/auth");

// Create a new profile
router.post("/people", auth, async (req, res) => {
  try {
    // Ensure each user can only create one profile
    const existing = await FindProfile.findOne({ userId: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const person = new FindProfile({
      userId: req.user.userId,
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
      image: req.body.image, // Base64 string or null
    });

    await person.save();
    res.status(201).json(person);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update current user's profile
router.put("/profile/me", auth, async (req, res) => {
  try {
    const updateData = {
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
    };

    // If image is provided (could be Base64 string or null)
    if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    const updatedProfile = await FindProfile.findOneAndUpdate(
      { userId: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile: " + err.message });
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

// Get all profiles except current user's
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

// Get match details by ID
router.get("/matches/:matchId", auth, async (req, res) => {
  try {
    const match = await FindProfile.findById(req.params.matchId)
      .populate("userId", "name email");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({
      _id: match._id,
      userId: match.userId._id,
      user: {
        _id: match.userId._id,
        name: match.userId.name,
        email: match.userId.email
      },
      age: match.age,
      location: match.location,
      bio: match.bio,
      image: match.image,
      createdAt: match.createdAt
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
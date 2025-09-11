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
      { userId: req.user.userId },  // ensure only their profile updates
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


module.exports = router;

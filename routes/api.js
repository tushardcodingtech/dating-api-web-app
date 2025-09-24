const express = require("express");
const router = express.Router();
const FindProfile = require("../models/FindProfile");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // Import upload middleware
const fs = require('fs');
const path = require('path');

// Create a new profile with image upload
router.post("/people", auth, upload.single('image'), async (req, res) => {
  try {
    // Ensure each user can only create one profile
    const existing = await FindProfile.findOne({ userId: req.user.userId });
    if (existing) {
      // If there's an uploaded file, delete it since we're not using it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Profile already exists" });
    }

    const person = new FindProfile({
      userId: req.user.userId,
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
      image: req.file ? `/uploads/${req.file.filename}` : null, // Store file path
    });

    await person.save();
    res.status(201).json(person);
  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: err.message });
  }
});

// Update current user's profile with image upload
// Temporary fix - handle base64 images
router.put("/profile/me", auth, async (req, res) => {
  try {
    const updateData = {
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
    };

    // Handle base64 image if provided
    if (req.body.image && req.body.image.startsWith('data:image')) {
      // You could convert base64 to URL or store as string
      // For now, we'll just store it as string (not recommended for production)
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
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Get all profiles except current user's (for finding matches)
router.get("/people", auth, async (req, res) => {
  try {
    const people = await FindProfile.find({
      userId: { $ne: req.user.userId }
    }).populate("userId", "name");
    
    const peopleWithFullImageUrls = people.map(person => ({
      ...person.toObject(),
      image: person.image ? `${req.protocol}://${req.get('host')}${person.image}` : null    // Convert image paths to full URLs

    }));
    
    res.json(peopleWithFullImageUrls);
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
    const profileWithFullImageUrl = {
      ...profile.toObject(),
      image: profile.image ? `${req.protocol}://${req.get('host')}${profile.image}` : null    // Convert image path to full URL

    };

    res.json(profileWithFullImageUrl);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add new route to get match details by ID
router.get("/matches/:matchId", auth, async (req, res) => {
  try {
    const match = await FindProfile.findById(req.params.matchId)
      .populate("userId", "name email");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    const matchWithFullImageUrl = {
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
      image: match.image ? `${req.protocol}://${req.get('host')}${match.image}` : null, // Convert image path to full URL
      createdAt: match.createdAt
    };

    res.json(matchWithFullImageUrl);
  } catch (err) {
    console.error("Error fetching match details:", err);
    res.status(500).json({ 
      error: "Failed to fetch match details",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Serve uploaded images statically
router.use('/uploads', express.static('uploads'));

module.exports = router;
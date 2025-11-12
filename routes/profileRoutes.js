const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Get user profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile (with image upload)
router.put("/", auth, upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };

    // If user uploaded an image
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    // Prevent email/password changes via this route
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;

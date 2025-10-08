const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Create new admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    // Create token
    const token = jwt.sign(
      { id: newAdmin._id, role: "admin" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Admin created successfully.",
      token,
      admin: { id: newAdmin._id, email: newAdmin.email },
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email." });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24" }
    );

    return res.json({
      message: "Admin logged in successfully",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Match = require("../models/Match");

// Get all matches of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user.userId, // find matches where this user is included
    })
      .populate("users", "name age image bio location") // show user info
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

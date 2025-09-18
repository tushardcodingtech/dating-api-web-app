// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user.userId,
    }).populate("users", "name"); // get name from User

    // Now also fetch profile details for each matched user
    const result = [];
    for (const match of matches) {
      const otherUser = match.users.find(
        (u) => u._id.toString() !== req.user.userId
      );

      // Get user's profile
      const profile = await Profile.findOne({ userId: otherUser._id });
      result.push({
        _id: match._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          age: profile?.age,
          location: profile?.location,
          bio: profile?.bio,
          image: profile?.image,
        },
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

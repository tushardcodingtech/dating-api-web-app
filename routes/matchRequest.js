const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MatchRequest = require('../models/MatchRequest');
const Match = require("../models/Match");

// Send a match request
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId } = req.body;

    // Prevent duplicate pending requests
    const existing = await MatchRequest.findOne({
      sender: req.user.userId,
      receiver: receiverId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new MatchRequest({
      sender: req.user.userId,
      receiver: receiverId
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept a match request
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const request = await MatchRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Only receiver can accept
    if (request.receiver.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Check if match already exists
    let match = await Match.findOne({
      users: { $all: [request.sender, request.receiver] },
    });
    // If not, create a new match
    if (!match) {
      match = new Match({
        users: [request.sender, request.receiver],
        createdAt: new Date(),
      });
      await match.save();
    }
    res.json({ message: "Request accepted", request, match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// Reject a match request
router.post("/:id/reject", auth, async (req, res) => {
  try {
    const request = await MatchRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiver.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not allowed" });

    request.status = "rejected";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all match requests for the logged-in user
router.get("/pending", auth, async (req, res) => {
  try {
    const requests = await MatchRequest.find({
      receiver: req.user.userId,
      status: "pending",
    }).populate("sender", "name"); // populate sender's name

    const result = await Promise.all(
      requests.map(async (reqItem) => {
        const profile = await FindProfile.findOne({ userId: reqItem.sender._id });

        return {
          _id: reqItem._id,
          sender: {
            id: reqItem.sender._id,
            name: reqItem.sender.name,
            age: profile?.age || null,
            location: profile?.location || null,
            bio: profile?.bio || null,
            image: profile?.image || null,
          },
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;

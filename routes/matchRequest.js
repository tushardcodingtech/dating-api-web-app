const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MatchRequest = require('../models/MatchRequest');

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

    if (request.receiver.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not allowed" });

    request.status = "accepted";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      status: "pending"
    }).populate("sender", "name image"); // get sender's name & image

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/matchController");

// Send request
router.post("/send", auth, sendRequest);

// Get incoming requests
router.get("/incoming", auth, getRequests);

// Accept request
router.post("/accept", auth, acceptRequest);

// Reject request
router.post("/reject", auth, rejectRequest);

module.exports = router;

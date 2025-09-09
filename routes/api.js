const express = require("express");
const router = express.Router();
const FindProfile = require("../models/FindProfile");
const auth = require("../middleware/auth");

router.post("/people", async (req, res) => {
  try {
    const person = new FindProfile(req.body);
    await person.save(); 
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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


module.exports = router;

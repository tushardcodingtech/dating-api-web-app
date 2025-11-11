const express = require("express");
const {
  seedCategories,
  getCategories,
  getCategoryById,
  selectCategory, 
  getCategoryResults,
} = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/seed", seedCategories);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post("/select", auth, selectCategory);

router.get("/results/:categoryName", protect, getCategoryResults);

module.exports = router;

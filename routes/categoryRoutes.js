const express = require("express");
const {
  seedCategories,
  getCategories,
  getCategoryById,
  selectCategory, 
  getCategoryResults,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/seed", seedCategories);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post("/select", protect, selectCategory);

router.get("/results/:categoryName", protect, getCategoryResults);

module.exports = router;

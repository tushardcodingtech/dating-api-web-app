const express = require("express");
const { seedCategories, getCategories, getCategoryById } = require("../controllers/categoryController");

const router = express.Router();

router.post("/seed", seedCategories);
router.get("/", getCategories);
router.get("/:id", getCategoryById);

module.exports = router;

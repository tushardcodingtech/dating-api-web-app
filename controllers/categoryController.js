const Category = require("../models/Category");
const User = require("../models/User");
const categoryData = require("../seed/categoryData");
const { categoryRules } = require("../utils/categoryRules");

// ====================
// Seed static categories
// ====================
const seedCategories = async (req, res) => {
  try {
    await Category.deleteMany();
    await Category.insertMany(categoryData);
    res.status(201).json({ message: "Categories seeded successfully with updated interests." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ====================
// Get all categories (for homepage)
// ====================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================
// Get category details (for single category view)
// ====================
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================
//  User selects a category
// ====================
const selectCategory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { category } = req.body;
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    const rules = categoryRules[category];
    const age = user.age;

    //  Validate rules (age, gender, etc.)
    if (rules) {
      if (rules.minAge && age < rules.minAge)
        return res
          .status(403)
          .json({ message: `You must be at least ${rules.minAge}` });
      if (rules.maxAge && age > rules.maxAge)
        return res
          .status(403)
          .json({ message: `Max age for this category is ${rules.maxAge}` });
      if (rules.gender && user.gender?.toLowerCase() !== rules.gender)
        return res
          .status(403)
          .json({ message: `This category is only for ${rules.gender}s` });
    }

    //  Update category for user
    user.category = category;
    await user.save();

    res.json({
      message: "Category updated successfully",
      user: {
        name: user.name,
        category: user.category,
        age,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================
//  Get results (matches) by category
// ====================
const getCategoryResults = async (req, res) => {
  try {
    const user = req.user;
    const { categoryName } = req.params;

    // Find other users in same category
    const matches = await User.find({
      category: categoryName,
      _id: { $ne: user._id }, // exclude current user
    }).select("name gender interests dob category");

    res.json({
      category: categoryName,
      user: {
        name: user.name,
        age: user.age,
        gender: user.gender,
      },
      matches,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  seedCategories,
  getCategories,
  getCategoryById,
  selectCategory,   
  getCategoryResults,   
};

const Category = require("../models/Category");
const categoryData = require("../seed/categoryData");

// Seed static data (only once)
export const seedCategories = async (req, res) => {
  try {
    const existing = await Category.countDocuments();
    if (existing > 0)
      return res.status(400).json({ message: "Categories already seeded." });

    await Category.insertMany(categoryData);
    res.status(201).json({ message: "Categories seeded successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch category details (for “click” view)
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    // You can extend this later: fetch users, matches, etc.
    res.json({
      ...category.toObject(),
      matches: [
        { name: "Ava", age: 22, hobby: "Dancing" },
        { name: "Rohan", age: 24, hobby: "Travel" },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Category = require("../models/Category");
const MatchRequest = require("../models/MatchRequest");
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
//  Get results (matches)
// ====================

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

const getCategoryResults = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { categoryName } = req.params;

    const rules = categoryRules[categoryName];
    if (!rules) return res.status(400).json({ error: "Invalid category" });

    let query = {};

    // ==============================
    // EXCLUDE USERS WITH PENDING REQUESTS
    // ==============================
    const pendingRequests = await MatchRequest.find({
      $or: [
        { senderId: loggedInUser._id },
        { receiverId: loggedInUser._id }
      ],
      status: "pending",
    });

    const excludeIds = pendingRequests.flatMap(req => [
      req.senderId.toString(),
      req.receiverId.toString(),
    ]);

    const finalExcludeIds = excludeIds.filter(
      id => id !== loggedInUser._id.toString()
    );

    // Add exclusion rule
    query._id = { 
      $ne: loggedInUser._id,
      $nin: finalExcludeIds
    };

    // ==============================
    // Gender Rule
    // ==============================
    if (rules.gender) query.gender = rules.gender;

    // ==============================
    // Age Filters
    // ==============================
    if (rules.minAge || rules.maxAge) {
      query.dob = {};

      if (rules.minAge) {
        const maxDOB = new Date();
        maxDOB.setFullYear(maxDOB.getFullYear() - rules.minAge);
        query.dob.$lte = maxDOB;
      }

      if (rules.maxAge) {
        const minDOB = new Date();
        minDOB.setFullYear(minDOB.getFullYear() - rules.maxAge);
        query.dob.$gte = minDOB;
      }
    }

    const matches = await User.find(query).select("name gender dob interests category");

    const matchesWithAge = matches.map(u => ({
      ...u._doc,
      age: calculateAge(u.dob)
    }));

    res.json({
      category: categoryName,
      user: loggedInUser,
      matches: matchesWithAge,
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

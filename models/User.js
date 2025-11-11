const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  phone: {
    type: String,
    required: false,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: false,
  },

  dob: {
    type: Date,
    required: false,
  },

  location: {
    type: String,
    required: false,
  },

  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "widowed"],
    required: false,
  },

  interests: {
    type: [String],
    default: [],
  },

  category: {
    type: String,
    default: null,
  },

  agree: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


//  Virtual field to calculate age from DOB
userSchema.virtual("age").get(function () {
  if (!this.dob) return null;
  const diff = Date.now() - this.dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Include virtuals in responses
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

//  Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

//  Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

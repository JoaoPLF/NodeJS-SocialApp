const mongoose = require("mongoose");
const validateEmail = require("../utils/validateEmail");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true, lowercase: true },
  handle: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true, trim: true, select: false },
  createdAt: { type: Date, default: Date.now },
  profileImage: { type: String, default: `blank-profile-image.png` },
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  location: { type: String, default: "" },
});

userSchema.methods.validateEmail = function() {
  return validateEmail(this.email);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
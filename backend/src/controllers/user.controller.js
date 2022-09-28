const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");
const checkRequiredFields = require("../utils/checkRequiredFields");

const checkUserExists = async (email, handle) => {
  try {
    const user = await User.find({ $or: [{ email: { "$regex": `^${email}$`, "$options": "i" } }, { handle: { "$regex": `^${handle}$`, "$options": "i" } }] });

    if (user.length > 0) {
      if (user[0].email === email) {
        return { exists: true, field: "Email" };
      }
      else {
        return { exists: true, field: "Handle" }
      }
    }

    return { exists: false };
  }
  catch (err) {
    errorLogger(err, "Could not get User");
  }
};

const generateToken = (user) => {
  return jwt.sign({ user_id: user._id, handle: user.handle }, process.env.TOKEN_KEY);
};

exports.createUser = async ({ email, handle, password, confirmPassword }) => {
  try {
    if (!checkRequiredFields({ email, handle, password, confirmPassword })) {
      throw new ValidationError("Required fields are missing.");
    }

    if (password !== confirmPassword) {
      throw new ValidationError("Password confirmation does not match the password.");
    }

    const userCheck = await checkUserExists(email, handle);

    if (userCheck.exists) {
      throw new ValidationError(`${userCheck.field} already in use.`);
    }

    const user = new User({ email, handle });

    if (user.validateEmail()) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;

      await user.save();

      const token = generateToken(user);
      return { token };
    }
    else {
      throw new ValidationError("Invalid email format.");
    }
  }
  catch (err) {
    errorLogger(err, "Could not create User");
  }
};

exports.loginUser = async ({ email, password }) => {
  try {
    if (!checkRequiredFields({ email, password })) {
      throw new ValidationError("Required fields are missing.");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      return { token };
    }
    else throw new ValidationError("Invalid credentials.");
  }
  catch (err) {
    errorLogger(err, "Could not login User");
  }
};

exports.setProfileImage = async (user, imagePath) => {
  return await User.findOneAndUpdate({ handle: user.handle }, { profileImage: imagePath });
};
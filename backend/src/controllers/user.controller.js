const User = require("../models/user.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");

const checkUserExists = async (email, handle) => {
  try {
    const user = await User.find({ $or: [{ email: { "$regex": `^${email}$`, "$options": "i" } }, { handle: { "$regex": `^${handle}$`, "$options": "i" } }] });
    return (user.length > 0);
  }
  catch (err) {
    const message = "Could not get Users";
    errorLogger(message, err);
    throw new Error(message);
  }
};

const createUser = async (email, handle, password) => {
  try {
    const newUser = new User({ email, handle, password });

    if (newUser.validateEmail()) {
      return await newUser.save();
    }
    else {
      throw new ValidationError("Invalid email format.");
    }
  }
  catch (err) {
    if (err instanceof ValidationError) {
      errorLogger(err.message, err);
      throw err;
    }

    const message = "Could not create User";
    errorLogger(message, err);
    throw new Error(message);
  }
}

module.exports = { checkUserExists, createUser };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const busboy = require("busboy");
const path = require("path");
const fs = require("fs");
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

    const user = await User.findOne({ email }, { _id: 1, email: 1, password: 1, handle: 1 });

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

exports.getProfileImage = async (handle) => {
  const { profileImage } = await User.findOne({ handle });

  return (path.resolve(`${path.resolve("./assets/profileImages")}/${profileImage}`));
};

exports.setProfileImage = async (req, res) => {
  const bb = busboy({ headers: req.headers });
  let imageFile;
  let filepath;

  bb.on("file", (name, stream, info) => {
    if (info.mimeType === "image/png" || info.mimeType === "image/jpeg") {
      const imageExtension = info.filename.split(".")[info.filename.split(".").length - 1];
      imageFile = `${req.user.handle}.${imageExtension}`;
      filepath = `${path.resolve("./assets/profileImages")}\\${imageFile}`;

      stream.pipe(fs.createWriteStream(filepath));
    }
    else {
      bb.emit("error", new Error("Invalid file type."));
    }
  });

  bb.on("error", (err) => {
    return res.send({ error: err.message });
  });

  bb.on("finish", async () => {
    await User.findOneAndUpdate({ handle: req.user.handle }, { profileImage: imageFile }, { new: true });
    return res.send({ result: "Image uploaded successfully." });
  });

  return bb;
};

exports.setUserDetails = async ({ handle, bio, website, location }) => {
  try {
    const params = {};
  
    if (bio !== undefined) params.bio = bio;
    if (website !== undefined) params.website = website;
    if (location !== undefined) params.location = location;
  
    return await User.findOneAndUpdate({ handle }, { ...params }, { new: true });
  }
  catch (err) {
    errorLogger(err, "Could not update user details.");
  }
};

exports.getAuthenticatedUser = async (handle) => {
  try {
    return await User.findOne({ handle });
  }
  catch (err) {
    errorLogger(err, "Could not get user.");
  }
};
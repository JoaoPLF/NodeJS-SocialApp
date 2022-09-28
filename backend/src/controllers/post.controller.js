const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");

exports.getAllPosts = async () => {
  try {
    return await Post.find().sort({ createdAt: -1 });
  }
  catch (err) {
    errorLogger(err, "Could not get Posts");
  }
};

exports.createPost = async ({ userHandle, body }) => {
  try {
    if (body.trim() === "") {
      throw new ValidationError("Post body must not be empty.");
    }

    const post = new Post({ userHandle, body });
    return await post.save();
  }
  catch (err) {
    errorLogger(err, "Could not create Post");
  }
};
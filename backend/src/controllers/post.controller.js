const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");

const getAll = async () => {
  try {
    return await Post.find().sort({ createdAt: -1 });
  }
  catch (err) {
    const message = "Could not get Posts";
    errorLogger(message, err);
    throw new Error(message);
  }
};

const createPost = async (userHandle, body) => {
  try {
    const newPost = new Post({ userHandle, body });
    return await newPost.save();
  }
  catch (err) {
    const message = "Could not create Post";
    errorLogger(message, err);
    throw new Error(message);
  }
}

module.exports = { getAll, createPost };
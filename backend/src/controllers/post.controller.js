const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");
const checkRequiredFields = require("../utils/checkRequiredFields");

const { getComments } = require("./comment.controller");

exports.getAllPosts = async () => {
  try {
    return await Post.find().sort({ createdAt: -1 });
  }
  catch (err) {
    errorLogger(err, "Could not get posts.");
  }
};

exports.getPost = async (postId) => {
  try {
    const comments = await getComments(postId);
    const posts = await Post.findById(postId);

    return { ...posts.toJSON(), comments: [...comments]};
  }
  catch (err) {
    errorLogger(err, "Could not get post.");
  }
};

exports.createPost = async ({ userHandle, body }) => {
  try {
    if (!checkRequiredFields({ body })) {
      throw new ValidationError("Post body must not be empty.");
    }

    const post = new Post({ userHandle, body });
    return await post.save();
  }
  catch (err) {
    errorLogger(err, "Could not create Post.");
  }
};
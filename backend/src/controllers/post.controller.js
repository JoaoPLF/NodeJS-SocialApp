const mongoose = require("mongoose");
const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");
const checkRequiredFields = require("../utils/checkRequiredFields");
const returnWithProfileImage = require("../utils/returnWithProfileImage");
const { getComments } = require("./comment.controller");

exports.getAllPosts = async () => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return await Promise.all(posts.map(returnWithProfileImage));
  }
  catch (err) {
    errorLogger(err, "Could not get posts.");
  }
};

exports.getPost = async (postId) => {
  try {
    const post = await Post.findById(postId);
    const comments = await getComments(postId);
    const postWithImage = await returnWithProfileImage(post);

    return { ...postWithImage, comments };
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

exports.likePost = async () => {

};

exports.unlikePost = async () => {

};
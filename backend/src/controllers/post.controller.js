const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");
const checkRequiredFields = require("../utils/checkRequiredFields");
const returnWithProfileImage = require("../utils/returnWithProfileImage");
const { getComments, deleteComments } = require("./comment.controller");
const { deleteLikes } = require("./like.controller");

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

exports.deletePost = async ({ userHandle, postId }) => {
  try {
    const post = await Post.findOne({ _id: postId, userHandle });

    if (!post) {
      throw new ValidationError("Could not find post.");
    }
    else {
      await deleteLikes(postId);
      await deleteComments(postId);
      await post.delete();

      return { message: "Post deleted." };
    }
  }
  catch (err) {
    errorLogger(err, "Could not delete Post.");
  }
};
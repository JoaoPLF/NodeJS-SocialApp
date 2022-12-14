const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const checkRequiredFields = require("../utils/checkRequiredFields");
const errorLogger = require("../utils/errorLogger");
const returnWithProfileImage = require("../utils/returnWithProfileImage");
const ValidationError = require("../utils/ValidationError");
const { createNotification, deleteNotification } = require("./notification.controller");

exports.getComments = async (postId) => {
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    return await Promise.all(comments.map(returnWithProfileImage));
  }
  catch (err) {
    errorLogger(err, "Could not get comments.");
  }
};

exports.createComment = async ({ userHandle, postId, body }) => {
  try {
    if (!checkRequiredFields({ body })) {
      throw new ValidationError("Comment must not be empty.");
    }

    const comment = new Comment({ userHandle, postId, body });
    await comment.save();

    const post = await Post.findById(postId);
    post.commentCount += 1;

    await createNotification({
      postId,
      sender: userHandle,
      recipient: post.userHandle,
      type: "comment",
      createdAt: comment.createdAt
    });

    await post.save();

    return await returnWithProfileImage(comment);
  }
  catch (err) {
    errorLogger(err, "Could not create comment.");
  }
};

exports.deleteComment = async ({ userHandle, postId, commentId }) => {
  try {
    let comment = await Comment.findOne({ userHandle, postId, _id: commentId });

    if (!comment) {
      throw new ValidationError("Comment does not exist.");
    }
    else {
      await comment.delete();
  
      const post = await Post.findById(postId);
      post.commentCount -= 1;

      await deleteNotification({
        postId,
        sender: userHandle,
        recipient: post.userHandle,
        type: "comment",
        createdAt: comment.createdAt
      });

      return await post.save();
    }
  }
  catch (err) {
    errorLogger(err, "Could not delete comment.");
  }
};

exports.deletePostComments = async (postId) => {
  try{
    await Comment.deleteMany({ postId });
  }
  catch (err) {
    errorLogger(err, "Could not delete comments.");
  }
};
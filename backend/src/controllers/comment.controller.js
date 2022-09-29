const Comment = require("../models/comment.model");
const checkRequiredFields = require("../utils/checkRequiredFields");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");

exports.getComments = async (postId) => {
  try {
    return await Comment.find({ postId }).sort({ createdAt: -1 });
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
    return await comment.save();
  }
  catch (err) {
    errorLogger(err, "Could not create comment.");
  }
};
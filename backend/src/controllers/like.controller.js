const Like = require("../models/like.model");
const Post = require("../models/post.model");
const errorLogger = require("../utils/errorLogger");
const ValidationError = require("../utils/ValidationError");

exports.likePost = async ({ userHandle, postId }) => {
  try {
    let like = await Like.findOne({ userHandle, postId });

    if (like) {
      throw new ValidationError("You have already liked this post.");
    }
    else {
      like = new Like({ userHandle, postId });
      await like.save();
  
      const post = await Post.findById(postId);
      post.likeCount += 1;
      return await post.save();
    }
  }
  catch (err) {
    errorLogger(err, "Could not like post.");
  }
};

exports.unlikePost = async ({ userHandle, postId }) => {
  try {
    let like = await Like.findOne({ userHandle, postId });

    if (!like) {
      throw new ValidationError("You have not liked this post.");
    }
    else {
      await like.delete();
  
      const post = await Post.findById(postId);
      post.likeCount -= 1;
      return await post.save();
    }
  }
  catch (err) {
    errorLogger(err, "Could not like post.");
  }
};

exports.deleteLikes = async (postId) => {
  try{
    await Like.deleteMany({ postId });
  }
  catch (err) {
    errorLogger(err, "Could not delete likes.");
  }
};
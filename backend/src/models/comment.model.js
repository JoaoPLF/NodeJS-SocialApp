const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userHandle: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
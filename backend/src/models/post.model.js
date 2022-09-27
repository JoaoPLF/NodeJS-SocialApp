const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userHandle: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
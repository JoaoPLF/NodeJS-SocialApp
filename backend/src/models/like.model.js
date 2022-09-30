const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userHandle: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  sender: { type: String, required: true },
  read: { type: Boolean, required: true, default: false },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["like", "comment"], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
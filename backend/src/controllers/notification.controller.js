const Notification = require("../models/notification.model");
const errorLogger = require("../utils/errorLogger");

exports.createNotification = async ({ postId, sender, recipient, type, createdAt }) => {
  try {
    const notification = new Notification({ postId, sender, recipient, type, createdAt });
    return await notification.save();
  }
  catch (err) {
    errorLogger(err, "Could not create notification.");
  }
};

exports.getUserNotifications = async (userHandle) => {
  return await Notification.find({ recipient: userHandle }).sort({ createdAt: -1 }).limit(10);
};

exports.deleteNotification = async ({ postId, sender, recipient, type, createdAt }) => {
  try {
    const notification = await Notification.findOne({ postId, sender, recipient, type, createdAt });

    await notification.delete();
    return { message: "Notification deleted." };
  }
  catch (err) {
    errorLogger(err, "Could not delete notification.");
  }
};

exports.markNotificationsRead = async ({ notifications, userHandle }) => {
  try {
    await Promise.all(notifications.map(async (notification) => {
      const res = await Notification.findOne({ _id: notification._id, recipient: userHandle });
      res.read = true;
      await res.save();
    }));

    return { message: "Notifications marked read" };
  }
  catch (err) {
    errorLogger(err, "Could not mark notifications read.");
  }
};
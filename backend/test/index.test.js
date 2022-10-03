const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const LikeModel = require("../src/models/like.model");
const CommentModel = require("../src/models/comment.model");
const NotificationModel = require("../src/models/notification.model");

before(async () => {
  try {
    await connectToDatabase();
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await LikeModel.deleteMany({});
    await CommentModel.deleteMany({});
    await NotificationModel.deleteMany({});
  }
  catch (err) {
    console.log(err);
  }
});

require("./user.test");
require("./post.test");
require("./like.test");
require("./comment.test");

after(async () => {
  try {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await LikeModel.deleteMany({});
    await CommentModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await disconnectFromDatabase();
  }
  catch (err) {
    console.log(err);
  }
});
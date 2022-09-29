const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const CommentModel = require("../src/models/comment.model");

before(async () => {
  try {
    await connectToDatabase();
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentModel.deleteMany({});
  }
  catch (err) {
    console.log(err);
  }
});

require("./user.test");
require("./post.test");

// describe("1", () => require("./user.test"));
// describe("2", () => require("./post.test"));
// describe("3", () => require("./comment.test"));

after(async () => {
  try {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentModel.deleteMany({});
    await disconnectFromDatabase();
  }
  catch (err) {
    console.log(err);
  }
});
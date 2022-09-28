require("./user.test");
require("./post.test");

const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");

before(async () => {
  try {
    await connectToDatabase();
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
  }
  catch (err) {
    console.log(err);
  }
});

after(async () => {
  try {
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await disconnectFromDatabase();
  }
  catch (err) {
    console.log(err);
  }
});
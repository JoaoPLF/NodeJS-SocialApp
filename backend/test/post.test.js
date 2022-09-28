require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");
const { before, after } = require("mocha");

const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");
const { createUser, loginUser } = require("../src/controllers/user.controller");
const { createPost } = require("../src/controllers/post.controller");
const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");

// before(async () => {
//   try {
//     await connectToDatabase();
//     await UserModel.deleteMany({});
//     await PostModel.deleteMany({});
//   }
//   catch (err) {
//     console.log(err);
//   }
// });

describe("Post", () => {
  it("Collection Posts should be empty", async () => {
    const posts = await PostModel.find();
    assert.isEmpty(posts);
  });

  describe("Create Post", () => {
    let token;
    let decode;

    it.skip("should create a new user", async () => {
      try {
        token = await createUser("test@test.com", "a", "123", "123");
        assert.isNotEmpty(token);
        assert.containsAllKeys(token, "token");
      }
      catch (err) {
        throw err;
      }
    });

    it("should login the user", async () => {
      try {
        token = await loginUser({ email: mockUser.email, password: mockUser.password });
      }
      catch (err) {
        throw err;
      }
    });

    it("should get the user handle from token", () => {
      decode = jwt.verify(token.token, process.env.TOKEN_KEY);
      assert.containsAllKeys(decode, "handle");
    });

    it("should throw ValidationError because post body is empty", async () => {
      try {
        const post = await createPost({ userHandle: decode.handle, body: "" });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new post", async () => {
      try {
        const body = "test";
        const post = await createPost({ userHandle: decode.handle, body });

        assert.isNotEmpty(post);
        assert.equal(post.body, body);
      }
      catch (err) {
        throw err;
      }
    });
  });
});

// after(async () => {
//   try {
//     await UserModel.deleteMany({});
//     await PostModel.deleteMany({});
//     await disconnectFromDatabase();
//   }
//   catch (err) {
//     console.log(err);
//   }
// });
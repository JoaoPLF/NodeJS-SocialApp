require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");
const { checkIfCollectionsCleared } = require("./utils");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const LikeModel = require("../src/models/like.model");
const NotificationModel = require("../src/models/notification.model");

const { createUser } = require("../src/controllers/user.controller");
const { createPost } = require("../src/controllers/post.controller");
const { likePost, unlikePost } = require("../src/controllers/like.controller");

const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");
const mockPost = require("./post.json");

const clearCollections = async () => {
  await checkIfCollectionsCleared([UserModel, PostModel, LikeModel, NotificationModel]);
};

describe("Like", () => {
  it("should clear collections before tests", clearCollections);

  describe("Create Like", () => {
    let user;
    let post;
    let like;

    it("should create a new user", async () => {
      try {
        const token = await createUser({ ...mockUser });
        assert.containsAllKeys(token, "token");

        user = jwt.verify(token.token, process.env.TOKEN_KEY);
        assert.containsAllKeys(user, "handle");
      }
      catch (err) {
        throw err;
      }
    });

    it("should create a new post", async () => {
      try {
        post = await createPost({ userHandle: user.handle, body: mockPost.body });

        assert.isNotEmpty(post);
        assert.equal(post.body, mockPost.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should like a post", async () => {
      try {
        assert.equal(post.likeCount, 0);
    
        post = await likePost({ userHandle: user.handle, postId: post._id });
    
        assert.equal(post.likeCount, 1);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError because post is already liked by user", async () => {
      try {    
        const result = await likePost({ userHandle: user.handle, postId: post._id });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should unlike a post", async () => {
      try {
        assert.equal(post.likeCount, 1);
    
        post = await unlikePost({ userHandle: user.handle, postId: post._id });
    
        assert.equal(post.likeCount, 0);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError because post has not been liked by user", async () => {
      try {    
        const result = await unlikePost({ userHandle: user.handle, postId: post._id });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });
  });

  it("should clear collections after tests", clearCollections);
});
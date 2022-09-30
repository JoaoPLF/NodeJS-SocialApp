require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const CommentModel = require("../src/models/comment.model");
const ValidationError = require("../src/utils/ValidationError");

const { createUser } = require("../src/controllers/user.controller");
const { getAllPosts, getPost, createPost } = require("../src/controllers/post.controller");
const { createComment } = require("../src/controllers/comment.controller");

const mockUser = require("./user.json");
const mockPost = require("./post.json");
const mockComment = require("./comment.json");

const clearCollections = async () => {
  await UserModel.deleteMany({});
  await PostModel.deleteMany({});
  await CommentModel.deleteMany({});
  return [await UserModel.find(), await PostModel.find(), await CommentModel.find()];
};

describe("Comment", () => {
  it("should clear collections before tests", async () => {
    const collections = await clearCollections();
    assert.isEmpty(collections[0]);
    assert.isEmpty(collections[1]);
    assert.isEmpty(collections[2]);
  });

  describe("Create comment", () => {
    let token;
    let decode;
    let postId;    

    it("should create a new user", async () => {
      try {
        token = await createUser({ ...mockUser });
        assert.isNotEmpty(token);
        assert.containsAllKeys(token, "token");
      }
      catch (err) {
        throw err;
      }
    });

    it("should get the user handle from token", () => {
      decode = jwt.verify(token.token, process.env.TOKEN_KEY);
      assert.containsAllKeys(decode, "handle");
    });

    it("should create a new post", async () => {
      try {
        const post = await createPost({ userHandle: decode.handle, ...mockPost });
        postId = post._id;

        assert.isNotNull(post);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw a ValidationError because the comment body is missing", async () => {
      try {
        const comment = await createComment({ userHandle: decode.handle, postId, body: "" });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new comment", async () => {
      try {
        const comment = await createComment({ userHandle: decode.handle, postId, ...mockComment });
        assert.equal(comment.body, mockComment.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should check if post has a comment", async () => {
      try {
        const post = await getPost(postId);
        assert.isNotNull(post.comments);
        assert.isAbove(post.commentCount, 0);
      }
      catch (err) {
        throw err;
      }
    });
  });

  it("should clear collections after tests", async () => {
    const collections = await clearCollections();
    assert.isEmpty(collections[0]);
    assert.isEmpty(collections[1]);
    assert.isEmpty(collections[2]);
  });
});
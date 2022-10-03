require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const LikeModel = require("../src/models/like.model");
const CommentModel = require("../src/models/comment.model");

const { createUser } = require("../src/controllers/user.controller");
const { createPost, getAllPosts, deletePost } = require("../src/controllers/post.controller");
const { likePost, unlikePost } = require("../src/controllers/like.controller");
const { createComment } = require("../src/controllers/comment.controller");

const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");
const mockPost = require("./post.json");
const mockComment = require("./comment.json");

const clearCollections = async () => {
  await UserModel.deleteMany({});
  await PostModel.deleteMany({});
  await LikeModel.deleteMany({});
  return [await UserModel.find(), await PostModel.find(), await LikeModel.find()];
};

describe("Post", () => {
  it("should clear collections before tests", async () => {
    const collections = await clearCollections();
    assert.isEmpty(collections[0]);
    assert.isEmpty(collections[1]);
    assert.isEmpty(collections[2]);
  });

  describe("Create Post", () => {
    let token;
    let decode;
    let post;

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
        post = await createPost({ userHandle: decode.handle, body: mockPost.body });

        assert.isNotEmpty(post);
        assert.equal(post.body, mockPost.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should get all posts", async () => {
      try {
        const posts = await getAllPosts();

        assert.isNotNull(posts);
        assert.lengthOf(posts, 1);
      }
      catch (err) {
        throw err;
      }
    });

    it("should like a post", async () => {
      try {
        assert.equal(post.likeCount, 0);
    
        post = await likePost({ userHandle: decode.handle, postId: post._id });
    
        assert.equal(post.likeCount, 1);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError because post is already liked by user", async () => {
      try {    
        const result = await likePost({ userHandle: decode.handle, postId: post._id });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should unlike a post", async () => {
      try {
        assert.equal(post.likeCount, 1);
    
        post = await unlikePost({ userHandle: decode.handle, postId: post._id });
    
        assert.equal(post.likeCount, 0);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError because post has not been liked by user", async () => {
      try {    
        const result = await unlikePost({ userHandle: decode.handle, postId: post._id });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new comment", async () => {
      try {
        const comment = await createComment({ userHandle: decode.handle, postId: post._id, ...mockComment });
        assert.equal(comment.body, mockComment.body);
      }
      catch (err) {
        throw err;
      }
    });
  
    it("should delete the post", async () => {
      try {
        const result = await deletePost({ userHandle: decode.handle, postId: post._id });
        const likes = await LikeModel.find({ postId: post._id });
        const comments = await CommentModel.find({ postId: post._id });
        post = await PostModel.findById(post._id);

        assert.containsAllKeys(result, "message");
        assert.isNull(post);
        assert.lengthOf(likes, 0);
        assert.lengthOf(comments, 0);
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
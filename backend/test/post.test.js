require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");
const { checkIfCollectionsCleared } = require("./utils");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const LikeModel = require("../src/models/like.model");
const CommentModel = require("../src/models/comment.model");

const { createUser } = require("../src/controllers/user.controller");
const { createPost, getAllPosts, deletePost } = require("../src/controllers/post.controller");
const { likePost, deleteLikes } = require("../src/controllers/like.controller");
const { createComment, deletePostComments } = require("../src/controllers/comment.controller");

const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");
const mockPost = require("./post.json");
const mockComment = require("./comment.json");

const clearCollections = async () => {
  await checkIfCollectionsCleared([UserModel, PostModel, LikeModel]);
};

describe("Post", () => {
  it("should clear collections before tests", clearCollections);

  describe("Create Post", () => {
    let user;
    let post;

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

    it("should throw ValidationError because post body is empty", async () => {
      try {
        const post = await createPost({ userHandle: user.handle, body: "" });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
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
    
        post = await likePost({ userHandle: user.handle, postId: post._id });
    
        assert.equal(post.likeCount, 1);
      }
      catch (err) {
        throw err;
      }
    });

    it("should create a new comment", async () => {
      try {
        const comment = await createComment({ userHandle: user.handle, postId: post._id, ...mockComment });
        assert.equal(comment.body, mockComment.body);
      }
      catch (err) {
        throw err;
      }
    });
  
    it("should delete the post", async () => {
      try {
        await deletePostComments(post._id);
        await deleteLikes(post._id);
        const result = await deletePost({ userHandle: user.handle, postId: post._id });

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

  it("should clear collections after tests", clearCollections);
});
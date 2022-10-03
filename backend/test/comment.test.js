require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");
const { checkIfCollectionsCleared } = require("./utils");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");
const CommentModel = require("../src/models/comment.model");
const NotificationModel = require("../src/models/notification.model");
const ValidationError = require("../src/utils/ValidationError");

const { createUser } = require("../src/controllers/user.controller");
const { getPost, createPost } = require("../src/controllers/post.controller");
const { createComment, deleteComment } = require("../src/controllers/comment.controller");

const mockUser = require("./user.json");
const mockPost = require("./post.json");
const mockComment = require("./comment.json");


const clearCollections = async () => {
  await checkIfCollectionsCleared([UserModel, PostModel, CommentModel, NotificationModel]);
};

describe("Comment", () => {
  it("should clear collections before tests", clearCollections);

  describe("Create comment", () => {
    let user;
    let postId;
    let post;
    let comment;

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
        const post = await createPost({ userHandle: user.handle, ...mockPost });
        postId = post._id;

        assert.isNotNull(post);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw a ValidationError because the comment body is missing", async () => {
      try {
        const comment = await createComment({ userHandle: user.handle, postId, body: "" });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new comment", async () => {
      try {
        comment = await createComment({ userHandle: user.handle, postId, ...mockComment });
        assert.equal(comment.body, mockComment.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should check if post has a comment", async () => {
      try {
        post = await getPost(postId);
        assert.isNotNull(post.comments);
        assert.isAbove(post.commentCount, 0);
      }
      catch (err) {
        throw err;
      }
    });

    it("should delete the comment", async () => {
      try {
        assert.equal(post.commentCount, 1);
    
        post = await deleteComment({ userHandle: user.handle, postId: post._id, commentId: comment._id });
    
        assert.equal(post.commentCount, 0);
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError because post has not been liked by user", async () => {
      try {    
        const result = await deleteComment({ userHandle: user.handle, postId: post._id, commentId: comment._id });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });
  });

  it("should clear collections after tests", clearCollections);
});
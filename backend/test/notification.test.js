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
const { createComment, deleteComment } = require("../src/controllers/comment.controller");

const mockUser = require("./user.json");
const mockPost = require("./post.json");
const mockComment = require("./comment.json");
const { getUserNotifications, markNotificationsRead } = require("../src/controllers/notification.controller");

const clearCollections = async () => {
  await checkIfCollectionsCleared([UserModel, PostModel, LikeModel, NotificationModel]);
};

describe("Notification", () => {
  it("should clear collections before tests", clearCollections);

  describe("Create Notification", () => {
    let user;
    let post;
    let like;
    let comment;
    let notifications;

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

    it("should check if notification exists", async () => {
      try {
        like = await LikeModel.findOne({ postId: post._id, userHandle: user.handle });
        const notification = await NotificationModel.findOne({ postId: post._id, sender: user.handle, recipient: post.userHandle, type: "like", createdAt: like.createdAt });
        assert.isNotNull(notification);
      }
      catch (err) {
        throw err;
      }
    });

    it("should create a new comment", async () => {
      try {
        comment = await createComment({ userHandle: user.handle, postId: post._id, ...mockComment });
        assert.equal(comment.body, mockComment.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should check if notification exists", async () => {
      try {
        const notification = await NotificationModel.findOne({ postId: post._id, sender: user.handle, type: "comment", createdAt: comment.createdAt });
        assert.isNotNull(notification);
      }
      catch (err) {
        throw err;
      }
    });

    it("should check user's notifications", async () => {
      try {
        notifications = await getUserNotifications(user.handle);
        assert.lengthOf(notifications, 2);
      }
      catch (err) {
        throw err;
      }
    });

    it("should mark notifications read", async () => {
      try {
        await markNotificationsRead({ notifications, userHandle: user.handle });
        notifications = await getUserNotifications(user.handle);

        assert.equal(notifications[0].read, true);
        assert.equal(notifications[1].read, true);
      }
      catch (err) {
        throw err;
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

    it("should check if notification was deleted", async () => {
      try {
        const notification = await NotificationModel.findOne({ postId: post._id, sender: user.handle, recipient: post.userHandle, type: "like", createdAt: like.createdAt });
        assert.isNull(notification);
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

    it("should check if notification was deleted", async () => {
      try {
        const notification = await NotificationModel.findOne({ postId: post._id, sender: user.handle, recipient: post.userHandle, type: "comment", createdAt: comment.createdAt });
        assert.isNull(notification);
      }
      catch (err) {
        throw err;
      }
    });
  });

  it("should clear collections after tests", clearCollections);
});
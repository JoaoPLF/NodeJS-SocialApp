const express = require("express");
const authMiddleware = require("../middleware/auth");
const { createPost, getAllPosts, getPost, deletePost } = require("../controllers/post.controller");
const { createComment } = require("../controllers/comment.controller");
const { likePost, unlikePost } = require("../controllers/like.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await getAllPosts();
    return res.send(result);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { body } = req.body;
    
    const post = await createPost({ userHandle: user.handle, body });
    return res.send(post);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await getPost(postId);
    return res.send(post);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const result = await deletePost({ userHandle: user.handle, postId });

    return res.send(result);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    const { body } = req.body;

    const comment = await createComment({ userHandle: user.handle, postId, body });
    return res.send(comment);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const post = await likePost({ userHandle: user.handle, postId });
    return res.send(post);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/:postId/unlike", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const post = await unlikePost({ userHandle: user.handle, postId });
    return res.send(post);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
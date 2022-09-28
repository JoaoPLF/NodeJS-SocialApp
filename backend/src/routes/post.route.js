const express = require("express");
const { createPost, getAllPosts } = require("../controllers/post.controller");

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

router.post("/", async (req, res) => {
  try {
    const user = req.user;
    const { body } = req.body;

    const post = await createPost({ handle: user.handle, body });
    return res.send(post);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
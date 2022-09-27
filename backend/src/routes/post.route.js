const express = require("express");
const posts = require("../controllers/post.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await posts.getAll();
    return res.send(result);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userHandle, body } = req.body;
    const newPost = await posts.createPost(userHandle, body);
    return res.send(newPost);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
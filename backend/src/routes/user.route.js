const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getProfileImage, setProfileImage, setUserDetails, getUser } = require("../controllers/user.controller");
const { getUserPosts } = require("../controllers/post.controller");
const { getUserNotifications } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { handle } = req.user;

    const user = await getUser(handle);
    const notifications = await getUserNotifications(handle);

    return res.send({ ...user, notifications });
  }
  catch (err) {
    return res.send({ err: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { handle } = req.user;
    const { bio, website, location } = req.body;

    const userDetails = await setUserDetails({ handle, bio, website, location });
    return res.send(userDetails);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.get("/image", async (req, res) => {
  try {
    const { handle } = req.user;
  
    const filepath = await getProfileImage(handle);
  
    return res.sendFile(filepath);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/image", authMiddleware, async (req, res) => {
  const bb = await setProfileImage(req, res);
  req.pipe(bb);

  return;
});

router.get("/:handle", async (req, res) => {
  try {
    const { handle } = req.params;
    const user = await getUser(handle);
    const posts = await getUserPosts(handle);

    return res.send({ ...user, posts });
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
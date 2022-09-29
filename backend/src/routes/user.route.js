const express = require("express");
const { getProfileImage, setProfileImage, setUserDetails } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { handle } = req.user;

    const user = await getAuthenticatedUser(handle);
    return res.send(user);
  }
  catch (err) {
    return res.send({ err: err.message });
  }
});

router.post("/", async (req, res) => {
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
  const { handle } = req.user;

  const filepath = await getProfileImage(handle);

  return res.sendFile(filepath);
});

router.post("/image", async (req, res) => {
  const bb = await setProfileImage(req, res);
  req.pipe(bb);

  return;
});

module.exports = router;
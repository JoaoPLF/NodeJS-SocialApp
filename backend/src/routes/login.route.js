const express = require("express");
const { loginUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);
    return res.send(user);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
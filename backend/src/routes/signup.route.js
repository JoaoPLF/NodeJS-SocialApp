const express = require("express");
const { createUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password, confirmPassword, handle } = req.body;

    const user = await createUser({ email, handle, password, confirmPassword });
    return res.send(user);

  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
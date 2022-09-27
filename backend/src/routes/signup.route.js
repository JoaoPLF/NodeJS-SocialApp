const express = require("express");
const { checkUserExists, createUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password, confirmPassword, handle } = req.body;

    if (password !== confirmPassword) {
      throw new Error("Password confirmation does not match the password.");
    }

    const userCheck = await checkUserExists(email, handle);

    if (userCheck) {
      throw new Error("User already exists.");
    }

    const user = await createUser(email, handle, password);
    return res.send(user);

  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const { checkUserExists, createUser } = require("../controllers/user.controller");
const validateEmail = require("../utils/validateEmail");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      throw new Error("Invalid email format.");
    }




    const userCheck = await checkUserExists(email, handle);

    if (userCheck) {
      throw new Error("User already exists.");
    }

    return res.send(user);

  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
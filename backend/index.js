require("dotenv").config();
const express = require("express");
const { connectToDatabase } = require("./src/config/database.config");

const authMiddleware = require("./src/middleware/auth");

const posts = require("./src/routes/post.route");
const signup = require("./src/routes/signup.route");
const login = require("./src/routes/login.route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.use("/posts", authMiddleware,posts);
app.use("/signup", signup);
app.use("/login", login);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
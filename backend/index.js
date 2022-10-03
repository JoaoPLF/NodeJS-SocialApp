require("dotenv").config();
const express = require("express");
const { connectToDatabase } = require("./src/config/database.config");

const posts = require("./src/routes/post.route");
const signup = require("./src/routes/signup.route");
const login = require("./src/routes/login.route");
const user = require("./src/routes/user.route");
const notification = require("./src/routes/notification.route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.use("/signup", signup);
app.use("/login", login);
app.use("/posts", posts);
app.use("/user", user);
app.use("/notification", notification);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
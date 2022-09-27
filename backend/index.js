const express = require("express");
const bodyParser = require("body-parser");
const { connectToDatabase } = require("./src/config/database.config");

const posts = require("./src/routes/post.route");
const signup = require("./src/routes/signup.route");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase();

app.use("/posts", posts);
app.use("/signup", signup);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
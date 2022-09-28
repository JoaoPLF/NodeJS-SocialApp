const express = require("express");
const busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const { setProfileImage } = require("../controllers/user.controller");

const router = express.Router();

router.get("/image", async (req, res) => {
  const UserModel = require("../models/user.model");

  const { handle } = req.user;
  const { profileImage } = await UserModel.findOne({ handle });

  return res.sendFile(path.resolve(`${path.resolve("./assets/profileImages")}/${profileImage}`));
});

router.post("/image", async (req, res) => {
  const bb = busboy({ headers: req.headers });
  let imageFile;
  let filepath;

  bb.on("file", (name, stream, info) => {
    if (info.mimeType === "image/png" || info.mimeType === "image/jpeg") {
      const imageExtension = info.filename.split(".")[info.filename.split(".").length - 1];
      imageFile = `${req.user.handle}.${imageExtension}`;
      filepath = `${path.resolve("./assets/profileImages")}\\${imageFile}`;

      stream.pipe(fs.createWriteStream(filepath));
    }
    else {
      bb.emit("error", new Error("Invalid file type"));
    }
  });

  bb.on("error", (err) => {

    return res.send({ error: err.message });
  });

  bb.on("finish", async () => {
    await setProfileImage(req.user, imageFile);
    return res.send({ result: "Image uploaded successfully." });
  });

  req.pipe(bb);

  return;
});

module.exports = router;
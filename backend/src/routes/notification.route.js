const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getUserNotifications, markNotificationsRead } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { handle } = req.user;

    const notifications = await getUserNotifications(handle);

    return res.send(notifications);
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { handle } = req.user;
    const notifications = req.body;

    return res.send(await markNotificationsRead({ notifications, userHandle: handle }));
  }
  catch (err) {
    return res.send({ error: err.message });
  }
});

module.exports = router;
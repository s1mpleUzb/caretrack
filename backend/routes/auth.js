const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.json({ success: false, message: "All fields required" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  if (user.password !== password) {
    return res.json({ success: false, message: "Wrong password" });
  }
  if (user.role !== role) {
    return res.json({ success: false, message: `Login as ${user.role}` });
  }

  res.json({
    success: true,
    message: `Welcome, ${user.username}!`,
    role: user.role,
  });
});

module.exports = router;

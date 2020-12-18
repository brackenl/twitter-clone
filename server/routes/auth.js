var express = require("express");
var router = express.Router();

var issueJWT = require("../utils/issueJWT");
var bcrypt = require("bcryptjs");

var User = require("../models/user");

// POST signup
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
      joinDate: Date.now(),
    });

    const foundUser = await User.findOne({ username: username });
    const token = issueJWT(foundUser);

    return res
      .status(201)
      .json({ user: foundUser, token, message: "Sign up successful" });
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
});

// POST login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const relUser = await User.findOne({ email }).select("+password");
    if (!relUser) {
      return res.status(400).json({ errors: { user: "User not found." } });
    }

    if (!bcrypt.compareSync(password, relUser.password)) {
      console.log(password, relUser.password);
      return res.status(400).json({ errors: { user: "Password incorrect." } });
    }

    const foundUser = await User.findById(relUser._id);
    const token = issueJWT(foundUser);

    return res
      .status(200)
      .json({ user: foundUser, message: "Log in successful.", token });
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
});

module.exports = router;

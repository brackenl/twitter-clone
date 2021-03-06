var express = require("express");
var router = express.Router();

var usersRouter = require("./users");
var postsRouter = require("./posts");
var authRouter = require("./auth");

router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/auth", authRouter);

module.exports = router;

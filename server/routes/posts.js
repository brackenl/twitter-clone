var express = require("express");
var router = express.Router();
var passport = require("passport");

var Post = require("../models/post");
var User = require("../models/user");

require("../strategies/jwt");

router.use(
  passport.authenticate("jwt", {
    session: false,
  })
);

// GET all Posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ posts: posts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET specific Post
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    return res.status(200).json({ post: post });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

/*
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  imgUrl: { type: String, required: false },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  replyRetweets: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
*/

// POST new Post
router.post("/", async (req, res, next) => {
  const { content, imgUrl } = req.body;

  try {
    const newPost = await Post.create({
      content,
      imgUrl,
      author: req.user._id,
      timestamp: Date.now(),
    });

    return res.status(200).json({ post: newPost, message: "Post created." });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// DELETE Post
router.delete("/:postId", async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);

    if (!deletedPost) {
      return res.status(400).json({ message: "Post not found." });
    }
    return res.status(200).json({ deletedPost: deletedPost });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;

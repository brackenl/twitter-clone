require("dotenv").config();
var faker = require("faker");
var bcrypt = require("bcryptjs");

var Post = require("../models/post");
var User = require("../models/user");
var Reply = require("../models/reply");

const users = [];
const posts = [];
const replies = [];

// require("../utils/mongoConfigTesting");

const seedTestDB = async () => {
  const user1 = new User({
    username: "testuser1",
    email: "test1@test.com",
    password: bcrypt.hashSync("password", 10),
    profilePicUrl: "http://placeimg.com/640/480/sports",
    joinDate: Date.now(),
    description: "The first user",
    posts: [],
    retweets: [],
    replyRetweets: [],
    followers: [],
    following: [],
  });

  const user2 = new User({
    username: "testuser2",
    email: "test2@test.com",
    password: bcrypt.hashSync("password", 10),
    profilePicUrl: "http://placeimg.com/640/480/city",
    joinDate: Date.now(),
    description: "The second user",
    posts: [],
    retweets: [],
    replyRetweets: [],
    followers: [],
    following: [],
  });

  const user3 = new User({
    username: "testuser3",
    email: "test3@test.com",
    password: bcrypt.hashSync("password", 10),
    profilePicUrl: "http://placeimg.com/640/480/transport",
    joinDate: Date.now(),
    description: "The third user",
    posts: [],
    retweets: [],
    replyRetweets: [],
    followers: [],
    following: [],
  });

  users.push(user1, user2, user3);

  // add followers and following
  users.forEach((user) => {
    const usersExcCurrentUser = users.filter((item) => item._id != user._id);

    user.followers = usersExcCurrentUser.map((user) => user._id);
    user.following = usersExcCurrentUser.map((user) => user._id);
  });

  // add posts
  users.forEach((user) => {
    const post1 = new Post({
      author: user._id,
      content: "Here is the first post!",
      timestamp: Date.now(),
      replies: [],
      favourites: [],
      retweets: [],
    });

    const post2 = new Post({
      author: user._id,
      content: "Here is the second post!",
      timestamp: Date.now(),
      replies: [],
      favourites: [],
      retweets: [],
    });

    const post3 = new Post({
      author: user._id,
      content: "Here is the third post!",
      timestamp: Date.now(),
      replies: [],
      favourites: [],
      retweets: [],
    });

    posts.push(post1, post2, post3);
    user.posts.push(post1._id, post2._id, post3._id);
  });

  // for now, just add random favourites, RTs and replies to the posts (+random RTs and favourites to the replies)

  //add favourites to post
  posts.forEach((post) => {
    const relUserInd = users.findIndex((item) => item._id == post.author);
    users[relUserInd].followers.forEach((follower) => {
      if (Math.random() > 0.6) {
        post.favourites.push(follower._id);
      }
    });
  });

  // add retweets to post
  posts.forEach((post) => {
    const relUserInd = users.findIndex((item) => item._id == post.author);
    users[relUserInd].followers.forEach((follower) => {
      if (Math.random() > 0.8) {
        // push RT'ing follower's id to post retweets array
        post.retweets.push(follower._id);
        // find follower and push post id to retweets
        const relIndex = users.findIndex((item) => item._id === follower._id);
        users[relIndex].retweets.push(post._id);
      }
    });
  });

  // add replies to post
  posts.forEach((post) => {
    const relUserInd = users.findIndex((item) => item._id == post.author);
    users[relUserInd].followers.forEach((follower) => {
      if (Math.random() > 0.8) {
        const newReply = new Reply({
          user: follower,
          content: faker.lorem.sentences(),
          timestamp: faker.date.recent(),
          post: post,
          favourites: [],
          retweets: [],
        });

        if (Math.random() > 0.6) {
          if (Math.random() > 0.5) {
            newReply.favourites.push(follower);
          } else {
            // push RT'ing follower's id into Reply retweets array
            newReply.retweets.push(follower);

            // push RT'd Reply into follower's replyRetweets array
            const relIndex = users.findIndex((item) => item._id === follower);
            users[relIndex].replyRetweets.push(newReply._id);
          }
        }
        // console.log(newReply);

        replies.push(newReply);
        post.replies.push(newReply._id);
      }
    });
  });

  return { users, posts, replies };
};

module.exports = seedTestDB;

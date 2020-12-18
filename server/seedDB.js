require("dotenv").config();
var faker = require("faker");
var bcrypt = require("bcryptjs");

var Post = require("./models/post");
var User = require("./models/user");
var Reply = require("./models/reply");

const users = [];
const posts = [];
const replies = [];

require("./utils/mongoConfig");

const shuffleArray = (relArr) => {
  const array = [...relArr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateUser = () => {
  const user = new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.internet.password(), 10),
    profilePicUrl: faker.image.image(),
    joinDate: faker.date.past(2),
    description: faker.lorem.sentences(),
    posts: [],
    retweets: [],
    replyRetweets: [],
    followers: [],
    following: [],
  });
  users.push(user);
};

const generateFollowers = () => {
  users.forEach((user) => {
    const usersExcCurrentUser = users.filter((item) => item._id != user._id);
    const shuffledUsers = shuffleArray(usersExcCurrentUser);
    const randSlicedUsers = shuffledUsers.slice(0, 10);

    user.followers = randSlicedUsers.map((user) => user._id);

    for (randUser of randSlicedUsers) {
      const relInd = users.findIndex((item) => item._id == randUser._id);
      users[relInd].following.push(user._id);
    }
  });
};

const generatePost = (user) => {
  // const randUserInd = Math.floor(Math.random() * users.length);
  // const randUser = users[randUserInd];

  const newPost = new Post({
    author: user,
    content: faker.lorem.sentences(),
    timestamp: faker.date.past(2),
    replies: [],
    favourites: [],
    retweets: [],
  });
  posts.push(newPost);
  user.posts.push(newPost._id);
};

const addPosts = () => {
  users.forEach((user) => {
    for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
      generatePost(user);
    }
  });
};

const addFavouritesToPost = () => {
  posts.forEach((post) => {
    post.author.followers.forEach((follower) => {
      if (Math.random() > 0.6) {
        post.favourites.push(follower._id);
      }
    });
  });
};

const addRetweetsToPost = () => {
  posts.forEach((post) => {
    post.author.followers.forEach((follower) => {
      if (Math.random() > 0.8) {
        // push RT'ing follower's id to post retweets array
        post.retweets.push(follower._id);
        // find follower and push post id to retweets
        const relIndex = users.findIndex((item) => item._id === follower._id);
        users[relIndex].retweets.push(post._id);
      }
    });
  });
};

const addRepliesToPost = () => {
  posts.forEach((post) => {
    post.author.followers.forEach((follower) => {
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
            newReply.favourites.push(follower._id);
          } else {
            // push RT'ing follower's id into Reply retweets array
            newReply.retweets.push(follower._id);

            // push RT'd Reply into follower's replyRetweets array
            const relIndex = users.findIndex(
              (item) => item._id === follower._id
            );
            users[relIndex].replyRetweets.push(newReply._id);
          }
        }

        replies.push(newReply);
        post.replies.push(newReply);
      }
    });
  });
};

const seedDB = async () => {
  for (let i = 0; i < 50; i++) {
    generateUser();
  }

  generateFollowers();
  addPosts();
  addFavouritesToPost();
  addRetweetsToPost();
  addRepliesToPost();

  for (user of users) {
    await user.save();
  }

  for (post of posts) {
    await post.save();
  }

  for (reply of replies) {
    await reply.save();
  }

  // console.log(users, posts, replies);
  return { users, posts, replies };
};

seedDB();

module.exports = seedDB;

require("dotenv").config();
var app = require("./app");
var request = require("supertest");
var mongoose = require("mongoose");

const dbHandler = require("../utils/mongoConfigTesting");

const generateTestDocs = require("./generateTestDocs");

let token;
let postId;

var Post = require("../models/post");
var User = require("../models/user");
var Reply = require("../models/reply");
const issueJWT = require("../utils/issueJWT");

beforeAll(async (done) => {
  await dbHandler.connect();

  await dbHandler.clearDatabase();
  const { users, posts, replies } = await generateTestDocs();

  postId = posts[0]._id;

  for (user of users) {
    await user.save();
  }

  for (post of posts) {
    await post.save();
  }

  for (reply of replies) {
    await reply.save();
  }

  done();
});

describe("GET /posts", () => {
  beforeAll(async () => {
    const user = await User.findOne({});
    token = issueJWT(user).token;
  });

  it("should return a 401 where req is unauthorised", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toEqual(401);
  });

  it("should return an array of posts when authorised", async () => {
    const res = await request(app).get("/posts").set("Authorization", token);

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("posts");
    expect(res.body.posts.length).toEqual(9);
  });
});

describe("GET /posts/:postId", () => {
  beforeAll(async () => {
    const user = await User.findOne({});
    token = issueJWT(user).token;
  });

  it("should return a 401 where req is unauthorised", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.statusCode).toEqual(401);
  });

  it("should return a specific post when authorised", async () => {
    const res = await request(app)
      .get(`/posts/${postId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.content).toEqual("Here is the first post!");
  });
});

describe("POST /posts/", () => {
  beforeAll(async () => {
    const user = await User.findOne({});
    token = issueJWT(user).token;
  });

  it("should return a 401 where req is unauthorised", async () => {
    const res = await request(app).post(`/posts/`);
    expect(res.statusCode).toEqual(401);
  });

  it("should create the relevant post and return it when authorised", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", token)
      .send({
        content: "The content of the new test post.",
        // imgUrl: "",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Post created.");
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.content).toEqual("The content of the new test post.");
  });
});

describe("DELETE /posts/:postId", () => {
  beforeAll(async () => {
    const user = await User.findOne({});
    token = issueJWT(user).token;
  });

  it("should return a 401 where req is unauthorised", async () => {
    const res = await request(app).delete(`/posts/${postId}`);
    expect(res.statusCode).toEqual(401);
  });

  it("should create the relevant post and return it when authorised", async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", token)
      .send({
        content: "The content of the new test post.",
        // imgUrl: "",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.content).toEqual("The content of the new test post.");
  });
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  await dbHandler.closeDatabase();
  done();
});

require("dotenv").config();
var app = require("./app");
var request = require("supertest");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const dbHandler = require("../utils/mongoConfigTesting");

const generateTestDocs = require("./generateTestDocs");

// let token;
// let postId;
// let commentId;

var Post = require("../models/post");
var User = require("../models/user");
var Reply = require("../models/reply");

beforeAll(async (done) => {
  // Add dummy data to test DB

  await dbHandler.connect();

  await dbHandler.clearDatabase();
  const { users } = await generateTestDocs();

  // for (user of users) {
  //   await user.save();
  // }

  done();
});

describe("POST /signup", () => {
  it("should return a token and user details", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Sign up successful");
    expect(res.body).toHaveProperty("user");

    expect(res.body.user.username).toEqual("testuser");
    expect(res.body.user.email).toEqual("testuser@example.com");
    expect(res.body.user).not.toHaveProperty("password");

    expect(res.body).toHaveProperty("token");

    const tokenParts = res.body.token.token.split(" ");
    const decodedToken = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    expect(decodedToken.username).toEqual("testuser");
  });

  it("should reject a signup with an email or username which has been taken", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveProperty("username");
    expect(res.body.errors).toHaveProperty("email");
    expect(res.body.errors.username.message).toEqual(
      "Error, expected `username` to be unique. Value: `testuser`"
    );
    expect(res.body.errors.email.message).toEqual(
      "Error, expected `email` to be unique. Value: `testuser@example.com`"
    );
  });
});

describe("POST /login", () => {
  const username = "joebloggs";
  const email = "joebloggs@example.com";
  const password = "password";

  beforeEach(async () => {
    const newUser = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      joinDate: Date.now(),
    });
  });

  it("should return a token and user details", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Log in successful.");
    expect(res.body.user.username).toEqual(username);
    expect(res.body.user.email).toEqual(email);
    expect(res.body.user).not.toHaveProperty("password");

    expect(res.body).toHaveProperty("token");

    const tokenParts = res.body.token.token.split(" ");
    const decodedToken = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    expect(decodedToken.username).toEqual(username);
  });
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  await dbHandler.closeDatabase();
  done();
});

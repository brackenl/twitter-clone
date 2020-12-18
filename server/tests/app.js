require("dotenv").config();
const express = require("express");
const passport = require("passport");

const app = express();

require("../utils/mongoConfigTesting");

const indexRouter = require("../routes/index");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

app.use("/", indexRouter);

module.exports = app;

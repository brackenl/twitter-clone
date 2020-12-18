require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");

var indexRouter = require("./routes/index");

require("./utils/mongoConfig");
// require("./utils/mongoConfigTesting");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", indexRouter);

module.exports = app;

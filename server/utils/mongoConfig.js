const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoDb = process.env.MONGODB_URI;

mongoose.connect(mongoDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

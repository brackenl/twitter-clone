var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReplySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  favourites: [{ type: Schema.Types.ObjectId, ref: "User" }],
  retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//Export model
module.exports = mongoose.model("Reply", ReplySchema);

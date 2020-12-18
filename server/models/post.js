var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  imgUrl: { type: String, required: false },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  replyRetweets: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

//Export model
module.exports = mongoose.model("Post", PostSchema);

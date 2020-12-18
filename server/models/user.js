var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var findOrCreate = require("mongoose-findorcreate");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // first_name: { type: String, required: true },
  // last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  profilePicUrl: { type: String },
  joinDate: { type: Date, required: true },
  description: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  replyRetweets: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  twitterId: { type: String },
});

// Apply the uniqueValidator plugin to UserSchema.
UserSchema.plugin(uniqueValidator);

// Apply findOrCreate plugin to UserSchema.
UserSchema.plugin(findOrCreate);

//Export model
module.exports = mongoose.model("User", UserSchema);

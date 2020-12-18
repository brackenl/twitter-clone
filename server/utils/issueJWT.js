const jwt = require("jsonwebtoken");

module.exports = (user) => {
  const _id = user._id;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    username: user.username,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

// module.exports.issueJWT = issueJWT;

const jwtoken = require("jsonwebtoken");

// set token
const secret = "myvalidtoken";
const expiration = "2h";

module.exports = {
  // Authenticated routes
  authMiddleware: function ({ req }) {
    
    let token = req.body.token || req.query.token || req.headers.authorization;


    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return { message: "No access token!" };
    }

    // token verification
    try {
      const { data } = jwtoken.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid Token");
    }
    return req;
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwtoken.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

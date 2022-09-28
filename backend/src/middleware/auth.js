const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split("Bearer ")[1];
  }
  else {
    return res.send("Unauthorized.");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  }
  catch (err) {
    return res.send("Invalid token.");
  }

  return next();
};

module.exports = verifyToken;
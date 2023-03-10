const jwt = require("jsonwebtoken");
const { errorResponse } = require("../Helper/response");
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send(errorResponse({}, "Token Not Provided."));
    return false;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send(errorResponse({}, "Invalid Token."));
      return false;
    }
    req.user = { email: decoded.email };
    next();
  });
};

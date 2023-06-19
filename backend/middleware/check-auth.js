const jwt = require("jsonwebtoken");
const HttpError = require("../utils/http-error");

module.exports = (req, res, next) => {
  try {
    // console.log(req.headers.authorization.split(" ")[1])
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    console.log(err)
    return next(error);
  }
};

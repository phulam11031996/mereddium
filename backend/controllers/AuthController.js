const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const UserHandler = require("../models/UserHandler");
const catchAsync = require("../utils/catchAsync");
const HttpError = require("../utils/http-error");

const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// sending TOKEN
const createSendToken = (user, statusCode, res) => {
  // creating TOKEN with option[expire]
  // const token = signToken(user._id);
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  // Check TOKEN ID though jwt.io, it is hashed and the same
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true, // send when we are using HTTPS
    httpOnly: true, // can not be modified with any browser
  };

  // remove password from output
  user.password = undefined;
  // sending cookie
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify Token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user is still exists
      const currentUser = await UserHandler.getUserById(decoded.id);
      if (!currentUser) {
        res.status(404).json({
          status: "failed to find a user",
          token: null,
        });
      }

      res.status(200).json({
        status: "success",
        user: currentUser,
      });
    } catch (err) {
      console.log(err);
      res.status(404).json({
        status: "failed to find a user | expired token",
        token: null,
      });
    }
  } else {
    res.status(404).json({
      status: "failed to find a user | expired token",
      token: null,
    });
  }
};

// POST /auth/login
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserHandler.getUserByEmail(email);
  let isValidInputs;
  if (user) {
    // added compare bcrypt password
    isValidInputs = await bcrypt.compare(password, user.password_bcrypt);
  }

  if (!isValidInputs) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    res.status(401).json({
      message: error.message,
    });
  } else {
    createSendToken(user, 200, res);
  }
});

// GET /auth/logout
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// POST /auth/signup
exports.signup = catchAsync(async (req, res) => {
  const result = await UserHandler.createUser(req.body);

  if (result instanceof HttpError) {
    res.status(result.code).json({
      message: result.message,
    });
  } else {
    createSendToken(result, 201, res);
  }
});

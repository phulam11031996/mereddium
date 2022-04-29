const express = require("express");
const authController = require("../controllers/AuthController");

const router = express.Router();

// /auth/login
router.route("/login").post(authController.login);

// /auth/logout
router.route("/logout").get(authController.logout);

// /auth/signup
router.route("/signup").post(authController.signup);

// /auth/me
router.route("/me").get(authController.isLoggedIn);

module.exports = router;

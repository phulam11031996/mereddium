const express = require('express');
const authController = require('../controllers/AuthController');

const router = express.Router();

// /auth/signin
router
  .route('/login')
  .post(authController.login);

// /auth/signup
router
  .route('/signup')
  .post(authController.signup);


module.exports = router;

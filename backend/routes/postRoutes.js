const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

// /post/
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// /post/:id
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);


module.exports = router;

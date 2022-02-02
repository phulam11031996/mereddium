const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router
  .route('/:id')
  .delete(userController.deleteUser);

module.exports = router;

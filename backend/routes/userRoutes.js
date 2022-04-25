const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// /user/
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

// /user/:id
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

// /user/saved/:id
router
  .route('/saved/:id')
  .get(userController.getSavedPosts)
  .post(userController.addSavedPost)
  .delete(userController.deleteSavedPost)

module.exports = router;

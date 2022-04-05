const express = require("express");
const router = express.Router();

const imageUpload = require("../middleware/imageUpload");
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

router
  .route("/image/:id")
  .patch(imageUpload.single("image"), userController.updateUserImageById);

module.exports = router;

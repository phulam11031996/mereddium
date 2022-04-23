const express = require("express");
const commentController = require("../controllers/CommentController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// /comment/
router
  .route("/")
  .get(commentController.getAllComments)
  .post(checkAuth, commentController.createComment);

// /comment/:id
router
  .route("/:id")
  .get(commentController.getCommentById)
  .patch(checkAuth, commentController.updateCommentById)
  .delete(checkAuth, commentController.deleteCommentById);

module.exports = router;

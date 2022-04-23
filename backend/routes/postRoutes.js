const express = require("express");
const postController = require("../controllers/PostController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// /post/
router
  .route("/")
  .get(postController.getAllPosts)
  .post(checkAuth, postController.createPost);

// /post/:id
router
  .route("/:id")
  .get(postController.getPostById)
  .patch(checkAuth, postController.updatePostById)
  .delete(checkAuth, postController.deletePostById);

// /post/vote/:id
router.route("/vote/:id").post(checkAuth, postController.votePost);

module.exports = router;

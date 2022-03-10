const express = require('express');
const postController = require('../models/PostHandler');

const router = express.Router();

// /post/
router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost); 

// /post/:id
router
  .route('/:id')
  .get(postController.getPostById)
  .patch(postController.updatePostById)
  .delete(postController.deletePostById);

// /post/vote/:id
router
  .route('/vote/:id')
  .post(postController.votePost);

module.exports = router;

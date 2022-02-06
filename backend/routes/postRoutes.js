const express = require('express');
const postController = require('../controllers/PostController');

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


module.exports = router;

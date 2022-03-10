const express = require('express');
const commentController = require('../models/CommentHandler');

const router = express.Router();

// /comment/
router
  .route('/')
  .get(commentController.getAllComments)
  .post(commentController.createComment);

// /comment/:id
router
  .route('/:id')
  .get(commentController.getCommentById)
  .patch(commentController.updateCommentById)
  .delete(commentController.deleteCommentById);


module.exports = router;

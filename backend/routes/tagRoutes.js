const express = require('express');
const tagController = require('../controllers/TagController');

const router = express.Router();

// /tag/
router
  .route('/')
  .get(tagController.getAllTags)
  .post(tagController.createTag);

// /tag/:id
router
  .route('/:id')
  .get(tagController.getTagById)
  .patch(tagController.updateTagById)
  .delete(tagController.deleteTagById);


module.exports = router;

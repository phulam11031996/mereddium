const CommentHandler = require("../models/CommentHandler");
const catchAsync = require("../utils/catchAsync");

const DatabaseHandler = require("../models/DatabaseHandler");
DatabaseHandler.createDbConnection();

// GET /comment/
exports.getAllComments = catchAsync(async (req, res) => {
  const allComments = await CommentHandler.getAllComments();

  res.status(200).json({
    status: "success",
    data: allComments,
  });
});

// POST /comment/
exports.createComment = catchAsync(async (req, res) => {
  const result = await CommentHandler.createComment(req.body);

  if (result === 0) {
    res.status(404).json({
      status: "failed to add comment to the post",
      data: req.body,
    });
  } else if (result == -1) {
    res.status(400).json({
      status: "failure: comment was created but wasn't added to the post",
      data: req.body,
    });
  } else if (!result) {
    res.status(400).json({
      status: "failed to create comment",
      data: req.body,
    });
  } else {
    res.status(201).json({
      status: "successfully added comment",
      data: result,
    });
  }
});

// GET /comment/{id}
exports.getCommentById = catchAsync(async (req, res) => {
  const comment = await CommentHandler.getCommentById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { comment },
  });
});

// UPDATE /comment/{id}
exports.updateCommentById = catchAsync(async (req, res) => {
  const response = await CommentHandler.updateCommentById(
    req.params.id,
    req.body.postId,
    req.body.message
  );

  if (response === 1) {
    res.status(200).json({
      status: "success",
      data: req.body,
    });
  } else if (response === 0) {
    res.status(400).json({
      status: "failure, nothing given to update",
      data: req.body,
    });
  } else if (response === -1) {
    res.status(404).json({
      status: "failure, comment not found",
      data: req.body,
    });
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

// DELETE /comment/{id}
exports.deleteCommentById = catchAsync(async (req, res) => {
  const response = await CommentHandler.deleteCommentById(
    req.params.id,
    req.body.postId
  );

  if (response.deletedCount && response.deletedCount === 1) {
    res.status(200).json({
      status: "success",
      data: { result },
    });
  } else if (response.deletedCount && response.deletedCount === 0) {
    res.status(404).json({
      status: "failed to delete comment",
      data: { result },
    });
  } else {
    res.status(response.code).json({ message: response.message });
  }
});

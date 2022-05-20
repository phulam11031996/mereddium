const PostHandler = require("../models/PostHandler");
const catchAsync = require("../utils/catchAsync");

const DatabaseHandler = require("../models/DatabaseHandler");
DatabaseHandler.createDbConnection();

// GET /post/
exports.getAllPosts = catchAsync(async (req, res) => {
  const allPosts = await PostHandler.getAllPosts();
  res.status(200).json({
    status: "success",
    data: allPosts,
  });
});

// POST /post/
exports.createPost = catchAsync(async (req, res) => {
  const newPost = await PostHandler.createPost(req.body);
  res.status(201).json({
    newPost,
  });
});

// // GET /post/{id}
exports.getPostById = catchAsync(async (req, res) => {
  const post = await PostHandler.getPostById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { post },
  });
});

// UPDATE /post/{id}
exports.updatePostById = catchAsync(async (req, res) => {
  const post = await PostHandler.updatePostById(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: { post },
  });
});

// // DELETE /post/{id}
exports.deletePostById = catchAsync(async (req, res) => {
  const result = await PostHandler.deletePostById(req.params.id);

  if (result.deletedCount == 1) {
    res.status(200).json({
      status: "success",
      data: { result },
    });
  } else {
    res.status(404).json({
      status: "failure",
      data: { result },
    });
  }
});

// POST /vote/{id}
exports.votePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const value = req.body.value;

  const result = await PostHandler.votePost(postId, userId, value);
  if (result === 0) {
    res.status(401).json({
      status: "Must login first!",
    });
  } else {
    const upVoteUsers = result[0];
    const downVoteUsers = result[1];
    res.status(200).json({
      status: "success",
      data: {
        upVoteUsers,
        downVoteUsers,
      },
    });
  }
});

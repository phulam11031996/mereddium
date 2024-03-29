const UserHandler = require("../models/UserHandler");
const PostHandler = require("../models/PostHandler");
const catchAsync = require("../utils/catchAsync");
const HttpError = require("../utils/http-error");

const DatabaseHandler = require("../models/DatabaseHandler");
DatabaseHandler.createDbConnection();

// GET /user/
exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await UserHandler.getAllUsers();
  res.status(200).json({
    status: "success",
    data: allUsers,
  });
});

// POST /user/
exports.createUser = catchAsync(async (req, res) => {
  let result = await UserHandler.createUser(req.body);

  if (result instanceof HttpError) {
    res.status(result.code).json({
      message: result.message,
    });
  } else {
    res.status(201).json({
      result,
    });
  }
});

// GET /user/{id}
exports.getUserById = catchAsync(async (req, res) => {
  const user = await UserHandler.getUserById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// UPDATE /user/{id}
exports.updateUserById = catchAsync(async (req, res) => {
  const result = await UserHandler.updateUserById(req.params.id, req.body);

  if (result.modifiedCount === 1) {
    res.status(200).json({
      status: "success",
      data: { result },
    });
  } else if (result.modifiedCount === 0) {
    res.status(200).json({
      status: "failure, nothing to update",
      data: { result },
    });
  } else {
    res.status(404).json({
      status: "failed to update user",
      data: { result },
    });
  }
});

// DELETE /user/{id}
exports.deleteUserById = catchAsync(async (req, res) => {
  const result = await UserHandler.deleteUserById(req.params.id);

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

// GET /user/saved/{id}
exports.getSavedPosts = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const savedPosts = await UserHandler.getSavedPosts(userId);

  if (savedPosts === 0) {
    res.status(401).json({ status: "Invalid user!" });
  } else {
    const savedPostList = await Promise.all(
      savedPosts.map(async ({ postId }) => {
        let post = await PostHandler.getPostById(postId);
        if (post === null) {
          return { removeSavedPost: postId };
        } else {
          return post;
        }
      })
    );

    let postsToRemove = savedPostList.filter(
      (post) => "removeSavedPost" in post
    );
    postsToRemove.map(
      async ({ removeSavedPost }) =>
        await UserHandler.deleteSavedPost(userId, removeSavedPost)
    );

    res.status(200).json({
      status: "success",
      data: savedPostList.filter((post) => !("removeSavedPost" in post)),
    });
  }
});

// POST /user/saved/{id}
exports.addSavedPost = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const postId = req.body.postId;
  const result = await UserHandler.addSavedPost(userId, postId);

  if (result === 0) {
    res.status(401).json({
      status: "Must login first!",
    });
  } else if (result === null) {
    res.status(200).json({
      status: "post already saved",
      data: { postId },
    });
  } else {
    res.status(201).json({
      status: "success",
      data: result,
    });
  }
});

// DELETE /user/saved/{id}
exports.deleteSavedPost = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const postId = req.body.postId;
  const result = await UserHandler.deleteSavedPost(userId, postId);

  if (result === null) {
    res.status(401).json({ status: "Must login first!" });
  } else {
    res.status(200).json({
      status: "success",
      data: result,
    });
  }
});

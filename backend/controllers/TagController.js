const TagHandler = require("../models/TagHandler");
const catchAsync = require("../utils/catchAsync");

const DatabaseHandler = require("../models/DatabaseHandler");
DatabaseHandler.createDbConnection();

// GET /tag/
exports.getAllTags = catchAsync(async (req, res) => {
  const allTags = await TagHandler.getAllTags();
  res.status(200).json({
    status: "success",
    data: allTags
  });
});

// POST /tag/
exports.createTag = catchAsync(async (req, res) => {
  const newTag = await TagHandler.createTag(req.body);
  res.status(201).json({
    newTag
  });
});

// GET /tag/{id}
exports.getTagById = catchAsync(async (req, res) => {
  const tag = await TagHandler.getTagById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { tag }
  });
});

// UPDATE /tag/{id}
exports.updateTagById = catchAsync(async (req, res) => {
  const result = await TagHandler.updateTagById(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: { result }
  });
});

// DELETE /tag/{id}
exports.deleteTagById = catchAsync(async (req, res) => {
  const result = await TagHandler.deleteTagById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { result }
  });
});

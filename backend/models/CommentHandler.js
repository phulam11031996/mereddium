const mongoose = require("mongoose");
const CommentSchema = require("./CommentSchema");
const PostHandler = require("./PostHandler");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

// GET /comment/
async function getAllComments() {
  const commentModel = mongoose.model("Comment", CommentSchema);

  let comments = await commentModel.find();
  return comments;
}

// POST /comment/
async function createComment(comment) {
  const commentModel = mongoose.model("Comment", CommentSchema);

  comment._id = uniqueID().slice(0, 6);

  const newComment = new commentModel(comment);
  const addedComment = await newComment.save();

  result = await PostHandler.addCommentByPostId(
    addedComment.postId,
    addedComment
  );
  if (result.modifiedCount === 0) {
    result = await commentModel.deleteOne({ _id: addedComment._id });
    return 0;
  }

  return addedComment;
}

// GET /comment/{id}
async function getCommentById(id) {
  const commentModel = mongoose.model("Comment", CommentSchema);

  const comment = await commentModel.findById({ _id: id });
  return comment;
}

// UPDATE /comment/{id}
async function updateCommentById(id, new_comment) {
  const commentModel = mongoose.model("Comment", CommentSchema);

  const result = await commentModel.updateOne(
    { _id: id },
    { $set: new_comment }
  );

  return result;
}

// DELETE /comment/{:id}
async function deleteCommentById(commentId, postId) {
  const commentModel = mongoose.model("Comment", CommentSchema);

  try {
    await PostHandler.deleteCommentByPostId(commentId, postId);
  } catch (err) {
    return err;
  }

  const result = await commentModel.deleteOne({ _id: commentId });
  return result;
}

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};

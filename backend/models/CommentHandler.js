const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const DatabaseHandler = require("./DatabaseHandler");
const PostHandler = require("./PostHandler");
const CommentSchema = require("./CommentSchema");
const PostSchema = require("./PostSchema");
const HttpError = require("../utils/http-error");

const uniqueID = () => {
  return uuidv4();
};

// GET /comment/
async function getAllComments() {
  const db = await DatabaseHandler.getDbConnection();
  const commentModel = db.model("Comment", CommentSchema);

  let result = await commentModel.find();
  return result;
}

// POST /comment/
async function createComment(comment) {
  const db = await DatabaseHandler.getDbConnection();
  const commentModel = db.model("Comment", CommentSchema);

  comment._id = uniqueID().slice(0, 6);

  const newComment = new commentModel(comment);

  await newComment.save();

  const result = await PostHandler.addCommentByPostId(
    comment.postId,
    newComment
  );

  return result;
}

// GET /comment/{id}
async function getCommentById(id) {
  const db = await DatabaseHandler.getDbConnection();
  const commentModel = db.model("Comment", CommentSchema);

  const result = await commentModel.findById({ _id: id });
  return result;
}

// UPDATE /comment/{id}
async function updateCommentById(id, new_comment) {
  const db = await DatabaseHandler.getDbConnection();
  const commentModel = db.model("Comment", CommentSchema);

  const comment = await commentModel.updateOne(
    { _id: id },
    { $set: new_comment }
  );

  return comment;
}

// DELETE /comment/{:id}
async function deleteCommentById(commentId, postId) {
  const db = await DatabaseHandler.getDbConnection();
  const commentModel = db.model("Comment", CommentSchema);

  try {
    const post = await PostHandler.deleteCommentByPostId(commentId, postId);
    const comment = await commentModel.deleteOne({ _id: commentId });
    return 1;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};

// try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await place.remove({ session: sess });
//     place.creator.places.pull(place);
//     await place.creator.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete place.',
//       500
//     );
//     return next(error);
//   }

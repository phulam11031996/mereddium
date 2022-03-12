const DatabaseHandler = require("./DatabaseHandler");
const PostHandler = require("./PostHandler");
const CommentSchema = require("./CommentSchema");
const PostSchema = require("./PostSchema");
const { v4: uuidv4 } = require('uuid');

const uniqueID = () => {
	return uuidv4();
}

// GET /comment/
async function getAllComments() {
	const db = await DatabaseHandler.getDbConnection();
	const commentModel = db.model('Comment', CommentSchema);

	let result = await commentModel.find();
	return result;
}

// POST /comment/
async function createComment(comment) {
	const db = await DatabaseHandler.getDbConnection();
	const commentModel = db.model('Comment', CommentSchema);
	const postModel = db.model('Post', PostSchema);

	comment._id = uniqueID().slice(0,6);
	
	const newComment = 
		new commentModel(
		{
			_id: comment._id, 
			userId: comment.userId, 
			postId: comment.postId,
			message: comment.message,
			upVote: comment.upVote
		}
	);
	
	const result = await newComment.save(function (err) {
	});

	await PostHandler.addCommentByPostId(comment.postId, newComment);

	return result;
}

// GET /comment/{id}
async function getCommentById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const commentModel = db.model('Comment', CommentSchema);

	const result = await commentModel.findById({'_id': id});
	return result;
}

// UPDATE /comment/{id}
async function updateCommentById(id, new_comment) {
	const db = await DatabaseHandler.getDbConnection();
	const commentModel = db.model('Comment', CommentSchema);

	const comment = await commentModel.updateOne(
		{'_id': id},
		{$set: new_comment}
	);

	return comment;
}

// DELETE /comment/{id}
async function deleteCommentById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const commentModel = db.model('Comment', CommentSchema);

	await commentModel.deleteOne({ _id: id});
	return 0;
}

module.exports = {
	getAllComments,
	createComment,
	getCommentById,
	updateCommentById,
	deleteCommentById
}

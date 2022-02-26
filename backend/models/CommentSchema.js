const mongoose = require("mongoose");

// Creating Comment Schema
const commentSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	postId: {
		type: String,
		required: true,
	},
	timeStamp: {
		type: Date,
		default: Date.now(),
	},
	lastModifiedAt: {
		type: Date,
		default: Date.now()
	},
	message: {
	  type: String,
	  minlength: 5,
	  required: [true, 'Please enter comment']
	},
	upVote: {
	  type: Number,
	  default: 1
	}		
});

// Creating Model with Schema tourSchema
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;


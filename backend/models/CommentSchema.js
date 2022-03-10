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
      	default: function() { return Date.now() },
	},
	lastModifiedAt: {
		type: String,
		default: function() { return Date.now() },
	},
	message: {
	  type: String,
	  required: [true, 'Please enter comment']
	},
	upVote: {
	  type: Number,
	  default: 1
	}		
});

module.exports = commentSchema;

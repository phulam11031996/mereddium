const mongoose = require("mongoose");

// Creating Post Schema
const postSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: [true, 'A person should have Last Name'],
	  },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	title: {
	  type: String,
	  required: [true, 'A title is required'],
	  minlength: 20,
	},
	message: {
		type: String,
		required: [true, 'Please enter content'],
		minlength: 50
	},
	comments: [
		{
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
				type: Date
			},
			message: {
			  type: String,
			  required: [true, 'Please enter comment']
			},
			upVote: {
			  type: Number,
			  default: 1
			}	
		}
	],
	turnOnComments: {
		type: Boolean,
		default: true
	},
	published: {
		type: Boolean,
		default: true 
	},
	lastModifiedAt: {
		type: Date,
		default: Date.now()
	},
	stringify: String,
	tags: [ 
		{
		tagId: {
			type: Number,
			required: [true, 'Please enter valid tagID']
		}
	}],
	upVote: {
		type: Number,
		default: 1
	  }
  });

// Creating Model with Schema tourSchema
const Post = mongoose.model('Post', postSchema);
module.exports = Post;


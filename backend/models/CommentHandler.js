const Comment = require("./CommentSchema");
const Post = require("./PostSchema");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// GET /comment/
exports.getAllComments = catchAsync(async (req, res) => {
	const allComments = await Comment.find();
	res.status(200).json({
	  status: 'success',
	  data: allComments
	});
});

// POST /comment/
exports.createComment = catchAsync(async (req, res) => {
	const result = req.body;
	var token = uniqueID();
	result._id = uniqueID().slice(0,6);
	
	const newComment = 
		new Comment(
			{ 
				_id: result._id, 
				userId: req.body.userId, 
				postId: req.body.postId,
				message: req.body.message,
				upVote: req.body.upVote,
			}
		);
	
	newComment.save(function (err) {
		Post.findOneAndUpdate(
				{ _id: req.body.postId }, 
				{ $push: { comments: newComment  } },
			   function (error, success) {
					 if (error) {
						res.status(404).json({
							status: 'failed to add comment',
							data: newComment
						});
					 } else {
						res.status(200).json({
							status: 'success, added comment',
							data: newComment
						  });
					 }
				 });
	});

});
// GET /comment/{id}
exports.getCommentById = catchAsync(async (req, res) => {
	const id = req.params.id;
	const comment = await Comment.findById({'_id': id});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		comment,
	  },
	});
});

// UPDATE /comment/{id}
exports.updateCommentById = catchAsync(async (req, res) => {
	const id = req.params.id;
	
	const comment = await Comment.updateOne({'_id': id}, {
		$set: req.body,
	});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		comment,
	  },
	});
});

// DELETE /comment/{id}
exports.deleteCommentById = catchAsync(async (req, res) => {
	const id = req.params.id;
	Comment.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
		} else {
			console.log(`Deleted comment with id: ${id}`);
			res.status(200).send(id).end();
		}
	})
});


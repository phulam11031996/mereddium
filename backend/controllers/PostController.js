const Post = require("../models/PostSchema");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// GET /post/
exports.getAllPosts = catchAsync(async (req, res) => {
	const allPosts = await Post.find();
	res.status(200).json({
	  status: 'success',
	  data: allPosts
	});
});

// POST /post/
exports.createPost = catchAsync(async (req, res) => {
	const result = req.body;
	const postId = uniqueID().slice(0,6);
	
	const newPost = 
		new Post(
			{ 
				_id: req.body.postId, 
				userId: req.body.userId, 
				title: req.body.title, 
				message: req.body.message,
				comments: req.body.comments, 
				turnOnComments: true,
				published: true, 
				stringify: req.body.stringify,
				tags: req.body.tags, 
				upVote: req.body.upVote
			}
		);
	
	newPost.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	res.status(201).json({
		result
	  });

});


// GET /post/{id}
exports.getPostById = catchAsync(async (req, res) => {
	const id = req.params.id;
	const post = await Post.findById({'_id': id});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		post,
	  },
	});
});

// UPDATE /post/{id}
exports.updatePostById = catchAsync(async (req, res) => {
	const id = req.params.id;
	
	const post = await Post.updateOne({'_id': id}, {
		$set: req.body,
	});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		post,
	  },
	});
});

// DELETE /post/{id}
exports.deletePostById = catchAsync(async (req, res) => {
	const id = req.params.id;
	Post.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
		} else {
			console.log(`Deleted post: ${id}`);
			res.status(200).send(id).end();
		}
	})
});


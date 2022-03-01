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
				_id: postId, 
				userId: req.body.userId, 
				title: req.body.title, 
				message: req.body.message,
				comments: [], 
				turnOnComments: true,
				published: true, 
				stringify: "req.body.stringify",
				tags: [],
				imageURL: req.body.imageURL, 
				upVoteUsers: [],
				downVoteUsers: []
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

// UPDATE /vote/{id}
exports.votePost = catchAsync(async (req, res) => {
	const postId = req.params.id;
	const userId = req.body.userId;
	const isUpVote = req.body.isUpVote

	let post = await Post.findById({'_id': postId});
	const index = post.upVoteUsers.indexOf(post.upVoteUsers.find(ele => ele.userId === userId));
	const index2 = post.downVoteUsers.indexOf(post.downVoteUsers.find(ele => ele.userId === userId));

	if (isUpVote) {
		if (index2 !== -1) 
			post.downVoteUsers = post.downVoteUsers.slice(0, index2).concat(post.downVoteUsers.slice(index2 + 1));
		
		index === -1 ?
		post.upVoteUsers = [...post.upVoteUsers, {userId: userId}] :
		post.upVoteUsers = post.upVoteUsers.slice(0, index).concat(post.upVoteUsers.slice(index + 1));
	} else {
		if (index !== 1) 
			post.upVoteUsers = post.upVoteUsers.slice(0, index).concat(post.upVoteUsers.slice(index + 1));	
		
		index2 === -1 ?
		post.downVoteUsers = [...post.downVoteUsers, {userId: userId}] :
		post.downVoteUsers = post.downVoteUsers.slice(0, index2).concat(post.downVoteUsers.slice(index2 + 1));
	}

	await Post.updateOne({'_id': postId}, {"downVoteUsers" : post.downVoteUsers})
	await Post.updateOne({'_id': postId}, {"upVoteUsers" : post.upVoteUsers})
	post = await Post.findById({'_id': postId})
	
	res.status(200).json({
	  status: 'success',
	  data: post,
	});
 

});
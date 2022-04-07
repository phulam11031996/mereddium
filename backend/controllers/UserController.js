const UserHandler = require('../models/UserHandler');
const PostHandler = require("./PostHandler");
const catchAsync = require('../utils/catchAsync');

// GET /user/
exports.getAllUsers = catchAsync(async (req, res) => {
	const allUsers = await UserHandler.getAllUsers();
	res.status(200).json({
	  status: 'success',
	  data: allUsers
	});
});

// POST /user/
exports.createUser = catchAsync(async (req, res) => {
	let result;
	
	try {	
		result = await UserHandler.createUser(req.body);
	} catch (err) {
		console.log(err);
	}
	if(result === undefined) {
		res.status(404).json({
			"Status": "Failed to create user!"
		});
	} else {
		res.status(201).json({
			result
		});
	}
});

// GET /user/{id}
exports.getUserById = catchAsync(async (req, res) => {
	const user = await UserHandler.getUserById(req.params.id);
	res.status(200).json({
	  status: 'success',
	  data: { user }
	});
});

// UPDATE /user/{id}
exports.updateUserById = catchAsync(async (req, res) => {
	const user = await UserHandler.updateUserById(req.params.id, req.body);
  
	res.status(200).json({
	  	status: 'success',
	  	data: { user }
	});
});

// DELETE /user/{id}
exports.deleteUserById = catchAsync(async (req, res) => {
	await UserHandler.deleteUserById(req.params.id);
  	res.status(200).send(req.params.id).end();
});

// GET /user/saved/{id}
exports.getSavedPosts = catchAsync(async (req, res) => {
	const userId = req.params.id;
	const savedPosts = await UserHandler.getSavedPosts(userId);

	let savedPostList = Array();
	await savedPosts.forEach(async function(obj) {
		let post = await PostHandler.getPostById(obj.postId);
		savedPostList.push(post);
	});

	res.status(200).json({
		status: 'success',
		data: { savedPostList }
	});
});

// POST /user/saved/{id}
exports.addSavedPost = catchAsync(async (req, res) => {
	const userId = req.params.id;
	const postId = req.body.postId;
	const result = await UserHandler.addSavedPost(userId, postId);
	
	if(result === 0) {
		res.status(401).json({ status: "Must login first!" });
	} else {
		res.status(201).json({
			status: 'success',
			data: { postId }
		});
	}
});

// DELETE /user/saved/{id}
exports.deleteSavedPost = catchAsync(async (req, res) => {
	const userId = req.params.id;
	const postId = req.body.postId;
	const result = await UserHandler.deleteSavedPost(userId, postId);

	if(result === 0) {
		res.status(401).json({ status: "Must login first!" });
	} else {
		const savedPosts = result;
		res.status(200).json({
			status: 'success',
			data: savedPosts
		});
	}
});

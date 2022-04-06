const UserHandler = require('../models/UserHandler');
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
	const user = await UserHandler.getUserById(userId);
	
	if(user === null) {
		res.status(401).json({ status: "Must login first!" });
	} else {
		let savedPosts = user['savedPosts'];

		savedPosts = savedPosts.sort((p1, p2) => {
			if(p1.dateSaved < p2.dateSaved)
				return 1;
			else
				return -1;
		});
		
		let savedPostList = Array();
		savedPosts.forEach(function(obj) {
			savedPostList.push(
				PostHandler.getPostById(obj.postId));
		});

		res.status(200).json({
			status: 'success',
			data: { savedPosts }
		});
	}
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

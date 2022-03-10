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
  	const result = await UserHandler.createUser(req.body);
	
	  if(!result) {
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
	const result = await UserHandler.deleteUserById(req.params.id);
  res.status(200).send(req.params.id).end();
});

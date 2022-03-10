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
  res.status(201).json({
		result
	});
});

// GET /user/{id}
exports.getUserById = catchAsync(async (req, res) => {
	const user = await UserHandler.getUserById(req.params.id);
	res.status(200).json({
	  status: 'success',
	  data: {
		user,
	  },
	});
});

// UPDATE /user/{id}
exports.updateUserById = catchAsync(async (req, res) => {
	const id = req.params.id;
  const new_user = req.body;

	const user = await UserHandler.updateUserById(id, new_user);
  
	res.status(200).json({
	  status: 'success',
	  data: {
		user,
	  },
	});
});

// DELETE /user/{id}
exports.deleteUserById = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result = await UserHandler.deleteUserById(id);
  res.status(200).send(id).end();
});


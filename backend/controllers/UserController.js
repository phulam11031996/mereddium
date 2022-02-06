const User = require("../models/UserSchema");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// GET /user/
exports.getAllUsers = catchAsync(async (req, res) => {
	res.status(200).json({
	  status: 'success',
	});
});

// POST /user/
exports.createUser = catchAsync(async (req, res) => {
	const result = req.body;
	var token = uniqueID();
	result._id = uniqueID().slice(0,6);
	
	const newUser = 
		new User(
			{ 
				_id: result._id, 
				firstName: req.body.firstName, 
				lastName: req.body.lastName,
				email: req.body.email, 
				role: req.body.role,
				photo: "default.jpg", 
				password: req.body.password,
				password_confirm: req.body.password_confirm, 
				passwordChangedAt: Date.now(),
				reset_token: token, 
				reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
				blocked: false,
				interestedIn: req.body.interestedIn
			}
		);
	
	newUser.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	res.status(201).json({
		result
	  });

});


// GET /user/{id}
exports.getUserById = catchAsync(async (req, res) => {
	const allUsers = await User.find();
  
	res.status(200).json({
	  status: 'success',
	  data: {
		allUsers,
	  },
	});
});

// UPDATE /user/{id}
exports.updateUserById = catchAsync(async (req, res) => {
	const allUsers = await User.find();
  
	res.status(200).json({
	  status: 'success',
	  data: {
		allUsers,
	  },
	});
});

// DELETE /user/{id}
exports.deleteUserById = catchAsync(async (req, res) => {
	const id = req.params.id;
	User.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
		} else {
			console.log(`Deleted user: ${id}`);
			res.status(200).send(id).end();
		}
	})
});


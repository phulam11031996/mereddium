const User = require("../models/User");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

exports.addUser = catchAsync(async (req, res) => {
	const result = req.body;
	result._id = uniqueID().slice(0,6);
	console.log(`Creating new USER ${result.id} ${result.name} ${result.job} `);

	const newUser = 
		new User({ _id: result._id, name: req.body.name, job: req.body.job});
	
	newUser.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	res.status(201).json({
		result
	  });

});

exports.deleteUser = catchAsync(async (req, res) => {
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

exports.getAllUsers = catchAsync(async (req, res) => {
	const allUsers = await User.find();
  
	res.status(200).json({
	  status: 'success',
	  data: {
		allUsers,
	  },
	});
  });
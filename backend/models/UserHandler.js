const DatabaseHandler = require("./DatabaseHandler");
const UserSchema = require("./UserSchema");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// GET /user/
async function getAllUsers () {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	let result = await userModel.find();
	return result;
};

// POST /user/
async function createUser(user) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	
	var token = uniqueID();
	
	const newUser = 
		new userModel(
			{ 
				_id: uniqueID().slice(0,6), 
				firstName: user.firstName, 
				lastName: user.lastName,
				email: user.email, 
				role: user.role,
				photo: "default.jpg", 
				password: user.password,
				password_confirm: user.password_confirm, 
				passwordChangedAt: Date.now(),
				reset_token: token, 
				reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
				blocked: false,
				interestedIn: user.interestedIn
			}
	);
	
	newUser.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	return user;
}


// GET /user/{id}
async function getUserById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	
	const user = await userModel.findById({'_id': id});
	return user;  
}


// UPDATE /user/{id}
async function updateUserById(id, newUser) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.updateOne({'_id': id}, {
		$set: newUser,
	});
  
	return user;
}

// DELETE /user/{id}
async function deleteUserById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	userModel.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
			return 0;
		} else {
			console.log(`Deleted user: ${id}`);
			return 1;
		}
	})
}

module.exports = {
	getAllUsers,
	createUser,
	getUserById,
	updateUserById,
	deleteUserById,
}
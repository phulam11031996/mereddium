const mongoose = require("mongoose");

// Creating User Schema
const UserSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	job: {
		type: String
	}
});

const User = mongoose.model("users", UserSchema);
module.exports = User;

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const DatabaseHandler = require("./DatabaseHandler");
const UserSchema = require("./UserSchema");
const HttpError = require("../utils/http-error");

const uniqueID = () => {
  return uuidv4();
};

// GET /user/
async function getAllUsers() {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);
  let result = await userModel.find();
  return result;
}

// POST /user/
async function createUser(user) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);
  const {
    firstName,
    lastName,
    email,
    role,
    password,
    password_confirm,
    interestedIn,
  } = user;

  if (firstName === "" || lastName === "" || password === "" || email === "") {
    const error = new HttpError("Please fill out all the information.", 422);
    return error;
  }

  let existingUser;
  try {
    existingUser = await userModel.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return error;
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return error;
  }

  if (password !== password_confirm) {
    const error = new HttpError("Passwords do not match.", 406);
    return error;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(user.password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not hash user's password, please try again.",
      500
    );
    return error;
  }

  var token = uniqueID();

  const newUser = new userModel({
    _id: uniqueID().slice(0, 6),
    firstName,
    lastName,
    email,
    role,
    password,
    password_confirm,
    interestedIn,
    password_bcrypt: hashedPassword,
    passwordChangedAt: Date.now(),
    reset_token: token,
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
  });

  let result;
  try {
    result = await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return error;
  }

  return result;
}

// GET /user/{id}
async function getUserById(id) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);

  const user = await userModel.findById({ _id: id });
  return user;
}

// UPDATE /user/{id}
async function updateUserById(id, newUser) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);

  const user = await userModel.updateOne(
    { _id: id },
    { $set: newUser }
  );

  return user;
}

// DELETE /user/{id}
async function deleteUserById(id) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);

  await userModel.deleteOne({ _id: id });
  return 0;
}

// GET /user/{email}
async function getUserByEmail(email) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);

  const user = await userModel.findOne({ email: email });
  return user;
}

// GET /user/saved/{id}
async function getSavedPosts(userId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.findOne({ _id: userId });
	if (user === null) {
		return 0;
	}

	let savedPosts = user.savedPosts.sort((p1, p2) => {
		return p2.dateSaved - p1.dateSaved;
	});

	return savedPosts;
}

// POST /user/saved/{id}
async function addSavedPost(userId, postId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.findOne({ _id: userId });
	if (user === null) {
		return 0;
	}

	let duplicate = user.savedPosts.find( (post) => post.postId === postId );
	if (duplicate !== undefined && duplicate !== null) {
		return null;
	}

	const result = await userModel.updateOne(
    {_id: userId},
    { $push: {savedPosts: { postId: postId} } }
  );
	
	return result;
}

// DELETE /user/saved/{id}
async function deleteSavedPost(userId, postId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const result = await userModel.updateOne(
    {_id: userId},
    { $pull: {savedPosts: { postId: postId} } }
  );
	
	return result;
}

// UPDATE /user/image/{id}
async function updateUserImageById(id, photoPath) {
  const db = await DatabaseHandler.getDbConnection();
  const userModel = db.model("User", UserSchema);

  const user = await userModel.updateOne(
    { _id: id },
    { photo: photoPath }
  );

  return user;
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  updateUserImageById,
  getSavedPosts,
	addSavedPost,
	deleteSavedPost
};

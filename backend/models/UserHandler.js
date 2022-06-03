const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");

const HttpError = require("../utils/http-error");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

// GET /user/
async function getAllUsers() {
  const userModel = mongoose.model("User", UserSchema);

  let result = await userModel.find();
  return result;
}

// POST /user/
async function createUser(user) {
  const userModel = mongoose.model("User", UserSchema);

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
  const userModel = mongoose.model("User", UserSchema);

  const user = await userModel.findById({ _id: id });
  return user;
}

// UPDATE /user/{id}
async function updateUserById(id, newUser) {
  const userModel = mongoose.model("User", UserSchema);

  // check if firstName, lastName, and email are empty and shouldn't be updated
  if (newUser.firstName === null || newUser.firstName === "") {
    delete newUser.firstName;
  }
  if (newUser.lastName === null || newUser.lastName === "") {
    delete newUser.lastName;
  }
  if (newUser.email === null || newUser.email === "") {
    delete newUser.email;
  }

  if (newUser.password && newUser.password !== "") {
    // if user is updating password, hash the new password
    const hashedPassword = await bcrypt.hash(newUser.password, 12);
    newUser.password_bcrypt = hashedPassword;
    newUser.passwordChangedAt = Date.now();
  } else {
    delete newUser.password;
    delete newUser.password_confirm;
  }

  const result = await userModel.updateOne({ _id: id }, { $set: newUser });
  return result;
}

// DELETE /user/{id}
async function deleteUserById(id) {
  const userModel = mongoose.model("User", UserSchema);

  const result = await userModel.deleteOne({ _id: id });
  return result;
}

// GET /user/{email}
async function getUserByEmail(email) {
  const userModel = mongoose.model("User", UserSchema);

  const user = await userModel.findOne({ email: email });
  return user;
}

// GET /user/saved/{id}
async function getSavedPosts(userId) {
  const userModel = mongoose.model("User", UserSchema);

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
  const userModel = mongoose.model("User", UserSchema);

  const user = await userModel.findOne({ _id: userId });
  if (user === null) {
    return 0;
  }

  let duplicate = user.savedPosts.find((post) => post.postId === postId);
  if (duplicate !== undefined && duplicate !== null) {
    return null;
  }

  const result = await userModel.updateOne(
    { _id: userId },
    { $push: { savedPosts: { postId: postId } } }
  );

  return result;
}

// DELETE /user/saved/{id}
async function deleteSavedPost(userId, postId) {
  const userModel = mongoose.model("User", UserSchema);

  const result = await userModel.updateOne(
    { _id: userId },
    { $pull: { savedPosts: { postId: postId } } }
  );

  return result;
}

// UPDATE /user/image/{id}
async function updateUserImageById(id, photoPath) {
  const userModel = mongoose.model("User", UserSchema);

  const result = await userModel.updateOne({ _id: id }, { photo: photoPath });

  return result;
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
  deleteSavedPost,
};

const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");
const UserHandler = require("./UserHandler");

// @ts-expect-error TS7016
const mockingoose = require("mockingoose");

const HttpError = require("../utils/http-error");
const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let userModel;

beforeAll(async () => {
  userModel = mongoose.model("User", UserSchema);
});

afterAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

afterEach(async () => {});

test("Fetching all users -- no users stored", async () => {
  userModel.find = jest.fn().mockResolvedValue([]);

  const users = await UserHandler.getAllUsers();
  expect(users).toBeDefined();
  expect(users.length).toBe(0); // 0 users

  expect(userModel.find.mock.calls.length).toBe(1);
  expect(userModel.find).toHaveBeenCalledWith();
});

test("Fetching all users -- 2 users stored", async () => {
  const result = [
    {
      _id: uniqueID().slice(0, 6),
      firstName: "Nick",
      lastName: "Bayati",
      email: "nb@email.com",
      role: "admin",
      photo: "v1650339103/default_ogjbtr.png",
      password: "password",
      password_confirm: "password",
      password_bcrypt: "password",
      passwordChangedAt: Date.now(),
      reset_token: uniqueID(),
      reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
      blocked: false,
      interestedIn: [],
      savedPosts: [],
    },
    {
      _id: "abc123",
      firstName: "Marco",
      lastName: "Polo",
      email: "marco@polo.com",
      role: "admin",
      photo: "v1650339103/default_ogjbtr.png",
      password: "password",
      password_confirm: "password",
      password_bcrypt: "password",
      passwordChangedAt: Date.now(),
      reset_token: uniqueID(),
      reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
      blocked: false,
      interestedIn: [],
      savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
    },
  ];
  userModel.find = jest.fn().mockResolvedValue(result);

  const users = await UserHandler.getAllUsers();
  expect(users).toBeDefined();
  expect(users.length).toBe(2); // 2 users

  expect(userModel.find.mock.calls.length).toBe(1);
  expect(userModel.find).toHaveBeenCalledWith();
});

// ------------------------------------
//       Adding User Tests
// ------------------------------------

test("Adding user", async () => {
  const user = {
    firstName: "N",
    lastName: "B",
    email: "nb@mail.co",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: [],
  };
  const addedUser = {
    _id: uniqueID().slice(0, 6),
    firstName: "N",
    lastName: "B",
    email: "nb@mail.co",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [],
  };
  mockingoose(userModel).toReturn(addedUser, "save");

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.createUser(user);
  expect(result).toBeDefined();
  expect(result).toHaveProperty("_id");
  expect(result.firstName).toBe(user.firstName);
  expect(result.lastName).toBe(user.lastName);
  expect(result.email).toBe(user.email);
  expect(result.role).toBe(user.role);
  expect(result.photo).toBe(user.photo);
  expect(result.password).toBe(user.password);
  expect(result.password_confirm).toBe(user.password_confirm);
  expect(result).toHaveProperty("password_bcrypt");
  expect(result).toHaveProperty("passwordChangedAt");
  expect(result).toHaveProperty("reset_token");
  expect(result).toHaveProperty("reset_token_ext");
  expect(result).toHaveProperty("blocked");
  expect(result.interestedIn).toStrictEqual(user.interestedIn);
  expect(result.savedPosts).toStrictEqual(user.savedPosts);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

test("Adding user -- missing info", async () => {
  const user = {
    firstName: "", // some fields are empty strings
    lastName: "",
    email: "",
    role: "admin",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: [],
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(
    new HttpError("Please fill out all the information.")
  );
});

test("Adding user -- sign up failed", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: { n: "\n" }, // incorrectly formatted email entry
    role: "admin",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: [],
  };

  userModel.findOne = jest.fn().mockImplementation(() => {
    throw new Error();
  });

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(
    new HttpError("Signing up failed, please try again later.")
  );

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

test("Adding user -- already existing", async () => {
  const user = {
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: [],
  };
  const alreadyAddedUser = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findOne = jest.fn().mockResolvedValue(alreadyAddedUser);

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(
    new HttpError("User exists already, please login instead.")
  );

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

test("Adding user -- passwords don't match", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: "password",
    password_confirm: "notmatching",
    interestedIn: [],
    savedPosts: [],
  };

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Passwords do not match."));

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

test("Adding user -- password couldn't be hashed", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: null, // null cannot be hashed
    password_confirm: null,
    interestedIn: [],
    savedPosts: [],
  };

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(
    new HttpError("Could not hash user's password, please try again.")
  );

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

test("Adding user -- failed to create user", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: " ", // a single space is not a valid password
    password_confirm: " ",
    interestedIn: [],
    savedPosts: [],
  };

  mockingoose(userModel).toReturn(new Error(), "save");

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(
    new HttpError("Could not create user, please try again.")
  );

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
});

// ------------------------------------
//      End of Adding User Tests
// ------------------------------------

test("Fetching user by id", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findById = jest.fn().mockResolvedValue(user);

  const foundUser = await UserHandler.getUserById("abc123");
  expect(foundUser).toBeDefined();
  expect(foundUser._id).toBe(user._id);
  expect(foundUser.firstName).toBe(user.firstName);
  expect(foundUser.lastName).toBe(user.lastName);
  expect(foundUser.email).toBe(user.email);
  expect(foundUser.role).toBe(user.role);
  expect(foundUser.photo).toBe(user.photo);
  expect(foundUser.password).toBe(user.password);
  expect(foundUser.password_confirm).toBe(user.password_confirm);
  expect(foundUser.password_bcrypt).toBe(user.password_bcrypt);
  expect(foundUser.passwordChangedAt).toBe(user.passwordChangedAt);
  expect(foundUser.reset_token).toBe(user.reset_token);
  expect(foundUser.reset_token_ext).toBe(user.reset_token_ext);
  expect(foundUser.blocked).toBe(user.blocked);
  expect(foundUser.interestedIn).toStrictEqual(user.interestedIn);
  expect(foundUser.savedPosts).toStrictEqual(user.savedPosts);

  expect(userModel.findById.mock.calls.length).toBe(1);
  expect(userModel.findById).toHaveBeenCalledWith({ _id: "abc123" });
});

test("Fetching user by email", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findOne = jest.fn().mockResolvedValue(user);

  const foundUser = await UserHandler.getUserByEmail("marco@polo.com");
  expect(foundUser).toBeDefined();
  expect(foundUser._id).toBe(user._id);
  expect(foundUser.firstName).toBe(user.firstName);
  expect(foundUser.lastName).toBe(user.lastName);
  expect(foundUser.email).toBe(user.email);
  expect(foundUser.role).toBe(user.role);
  expect(foundUser.photo).toBe(user.photo);
  expect(foundUser.password).toBe(user.password);
  expect(foundUser.password_confirm).toBe(user.password_confirm);
  expect(foundUser.password_bcrypt).toBe(user.password_bcrypt);
  expect(foundUser.passwordChangedAt).toBe(user.passwordChangedAt);
  expect(foundUser.reset_token).toBe(user.reset_token);
  expect(foundUser.reset_token_ext).toBe(user.reset_token_ext);
  expect(foundUser.blocked).toBe(user.blocked);
  expect(foundUser.interestedIn).toStrictEqual(user.interestedIn);
  expect(foundUser.savedPosts).toStrictEqual(user.savedPosts);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ email: "marco@polo.com" });
});

test("Updating user by id", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  const userUpdate = {
    firstName: "Marcus",
    lastName: "Pollock",
  };

  userModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await UserHandler.updateUserById(user._id, userUpdate);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1); // one document was updated

  expect(userModel.updateOne.mock.calls.length).toBe(1);
  expect(userModel.updateOne).toHaveBeenCalledWith(
    { _id: user._id },
    { $set: userUpdate }
  );
});

test("Updating user by id -- new password", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  const userUpdate = {
    password: "newPassword",
    password_confirm: "newPassword",
  };

  userModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await UserHandler.updateUserById(user._id, userUpdate);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1); // one document was updated

  expect(userModel.updateOne.mock.calls.length).toBe(1);
  expect(userModel.updateOne).toHaveBeenCalledWith(
    { _id: user._id },
    { $set: userUpdate }
  );
});

test("Deleting user by id", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };

  userModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  });

  const result = await UserHandler.deleteUserById(user._id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  expect(userModel.deleteOne.mock.calls.length).toBe(1);
  expect(userModel.deleteOne).toHaveBeenCalledWith({ _id: user._id });
});

test("Deleting user by id -- user not found", async () => {
  const id = "xyz000";
  userModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 0,
  });

  const result = await UserHandler.deleteUserById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);

  expect(userModel.deleteOne.mock.calls.length).toBe(1);
  expect(userModel.deleteOne).toHaveBeenCalledWith({ _id: id });
});

// ------------------------------------
//       User Saved Posts Tests
// ------------------------------------

test("Fetching saved posts", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findOne = jest.fn().mockResolvedValue(user);

  const savedPosts = await UserHandler.getSavedPosts(user._id);
  expect(savedPosts).toBeDefined();
  expect(savedPosts.length).toBe(2); // 2 saved posts

  const postIdArr = savedPosts.map(({ postId }) => postId);
  expect(postIdArr.includes("def456")).toBeTruthy();
  expect(postIdArr.includes("ghi789")).toBeTruthy();
  expect(postIdArr.includes("xyz000")).toBeFalsy();

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: "abc123" });
});

test("Fetching saved posts -- user has no posts saved", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [],
  };

  userModel.findOne = jest.fn().mockResolvedValue(user);

  const savedPosts = await UserHandler.getSavedPosts(user._id);
  expect(savedPosts).toBeDefined();
  expect(savedPosts.length).toBe(0); // 0 saved posts

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: "abc123" });
});

test("Fetching saved posts -- invalid user", async () => {
  const userId = "xyz000";

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.getSavedPosts(userId);
  expect(result).toBe(0);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: userId });
});

test("Adding saved post", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findOne = jest.fn().mockResolvedValue(user);

  userModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await UserHandler.addSavedPost(user._id, "xyz000");
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: user._id });

  expect(userModel.updateOne.mock.calls.length).toBe(1);
  expect(userModel.updateOne).toHaveBeenCalledWith(
    { _id: user._id },
    { $push: { savedPosts: { postId: "xyz000" } } }
  );
});

test("Adding saved post -- duplicate entry", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  userModel.findOne = jest.fn().mockResolvedValue(user);

  const result = await UserHandler.addSavedPost(user._id, "def456");
  expect(result).toBe(null);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: user._id });
});

test("Adding saved post -- invalid user", async () => {
  const userId = "xyz000";
  const postId = "def456";

  userModel.findOne = jest.fn().mockResolvedValue(null);

  const result = await UserHandler.addSavedPost(userId, postId);
  expect(result).toBe(0);

  expect(userModel.findOne.mock.calls.length).toBe(1);
  expect(userModel.findOne).toHaveBeenCalledWith({ _id: userId });
});

test("Deleting saved post", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };

  userModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await UserHandler.deleteSavedPost(user._id, "def456");
  expect(result.modifiedCount).toBe(1);

  expect(userModel.updateOne.mock.calls.length).toBe(1);
  expect(userModel.updateOne).toHaveBeenCalledWith(
    { _id: user._id },
    { $pull: { savedPosts: { postId: "def456" } } }
  );
});

test("Parse saved posts", async () => {
  // tests that UserSchema automatically adds in 'dateSaved' to saved posts
  //   (also tests the toJSON() method)
  const user = new userModel({
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  });
  const parsedUser = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [
      { postId: "def456", dateSaved: Date.now() },
      { postId: "ghi789", dateSaved: Date.now() },
    ],
  };
  mockingoose(userModel).toReturn(parsedUser, "save");

  const savedUser = user.save();
  expect(savedUser).toBeDefined();
  expect(savedUser).not.toStrictEqual(user.toJSON());
});

// ------------------------------------
//    End of User Saved Posts Tests
// ------------------------------------

test("Updating user image", async () => {
  const user = {
    _id: "abc123",
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    photo: "v1650339103/default_ogjbtr.png",
    password: "password",
    password_confirm: "password",
    password_bcrypt: "password",
    passwordChangedAt: Date.now(),
    reset_token: uniqueID(),
    reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [{ postId: "def456" }, { postId: "ghi789" }],
  };
  const photoPath = "v1234567890/fake_image.png";

  userModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await UserHandler.updateUserImageById(user._id, photoPath);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);

  expect(userModel.updateOne.mock.calls.length).toBe(1);
  expect(userModel.updateOne).toHaveBeenCalledWith(
    { _id: user._id },
    { photo: photoPath }
  );
});

const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");
const UserHandler = require("./UserHandler");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { v4: uuidv4 } = require('uuid');
const HttpError = require("../utils/http-error");

const uniqueID = () => {
  return uuidv4();
};

let mongoServer;
let conn;
let userModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = mongoose.createConnection(uri, mongooseOpts);

  userModel = conn.model("User", UserSchema);

  DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newUser = new userModel({ 
    _id: uniqueID().slice(0,6), 
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
    reset_token_ext: Date.now() + 60 * 60 * 1000,  // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: []
	});
  await newUser.save();

  const newUser2 = new userModel({ 
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
    reset_token_ext: Date.now() + 60 * 60 * 1000,  // 60 minutes
    blocked: false,
    interestedIn: [],
    savedPosts: [
      { postId: "def456" },
      { postId: "ghi789" }
    ]
	});
  await newUser2.save();
});

afterEach(async () => {
  await userModel.deleteMany();
});

test("Fetching all users", async () => {
  const users = await UserHandler.getAllUsers();
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
});

test("Fetching user by id", async () => {
  const id = "abc123";
  const user = await UserHandler.getUserById(id);
  expect(user).toBeDefined();
  expect(user._id).toBe(id);
});

test("Fetching user by email", async () => {
  const email = "marco@polo.com";
  const user = await UserHandler.getUserByEmail(email);
  expect(user).toBeDefined();
  expect(user.email).toBe(email);
});

test("Deleting user by id", async () => {
  const id = "abc123";
  await UserHandler.deleteUserById(id);
  
  const result = await UserHandler.getAllUsers();
  expect(result).toBeDefined();
  expect(result.length).toBe(1);
});

test("Updating user by id", async () => {
  const id = "abc123";
  const user = {
    email: "abc@email.com",
  };

  const result = await UserHandler.updateUserById(id, user);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);  // one document was updated
});

test("Adding user", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: []
  };
  
  const result = await UserHandler.createUser(user);
  expect(result).toBeDefined();
});

test("Adding user -- already existing", async () => {
  const user = {
    firstName: "Marco",
    lastName: "Polo",
    email: "marco@polo.com",
    role: "admin",
    password: "password",
    password_confirm: "password", 
    interestedIn: [],
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("User exists already, please login instead."));
});

test("Adding user -- missing info", async () => {
  const user = {
    firstName: "",  // some fields are empty strings
    lastName: "",
    email: "",
    role: "admin",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Please fill out all the information."));
});

test("Adding user -- sign up failed", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: { n: "\n" },  // incorrectly formatted email entry
    role: "admin",
    password: "password",
    password_confirm: "password",
    interestedIn: [],
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Signing up failed, please try again later."));
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
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Passwords do not match."));
});

test("Adding user -- password couldn't be hashed", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: null,  // null cannot be hashed
    password_confirm: null,
    interestedIn: [],
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Could not hash user's password, please try again."));
});

test("Adding user -- failed to create user", async () => {
  const user = {
    firstName: "A",
    lastName: "B",
    email: "abc@mail.com",
    role: "admin",
    password: " ",  // a single space is not a valid password
    password_confirm: " ",
    interestedIn: [],
    savedPosts: []
  };

  const result = await UserHandler.createUser(user);
  expect(result).toStrictEqual(new HttpError("Could not create user, please try again."));
});

test("Fetching saved posts", async () => {
  const userId = "abc123";
  const postId1 = "def456";
  const postId2 = "ghi789";

  const result = await UserHandler.getSavedPosts(userId);
  expect(result).toBeDefined();
  expect(result.length).toBe(2);
  expect(result[0].postId).toBe(postId1);
  expect(result[1].postId).toBe(postId2);
});

test("Fetching saved posts -- user has no posts saved", async () => {
  const userId = "abc123";

  let user = await userModel.find();
  user = user.find(({ _id }) => _id !== userId);

  const result = await UserHandler.getSavedPosts(user._id);
  expect(result).toBeDefined();
  expect(result.length).toBe(0);
});

test("Fetching saved posts -- invalid user", async () => {
  const userId = "xyz000";
  const result = await UserHandler.getSavedPosts(userId);
  expect(result).toBe(0);
});

test("Adding saved post", async () => {
  const userId = "abc123";
  const postId = "xyz000";

  const result = await UserHandler.addSavedPost(userId, postId);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);

  const user = await userModel.findOne({ _id: userId });
  expect(user).toBeDefined();
  expect(user.savedPosts.length).toBe(3);
  expect(user.savedPosts[2].postId).toBe(postId);
});

test("Adding saved post -- duplicate entry", async () => {
  const userId = "abc123";
  const postId = "def456";

  const result = await UserHandler.addSavedPost(userId, postId);
  expect(result).toBe(null);

  const user = await userModel.findOne({ _id: userId });
  expect(user).toBeDefined();
  expect(user.savedPosts.length).toBe(2);
  expect(user.savedPosts[0].postId).toBe(postId);
});

test("Adding saved post -- invalid user", async () => {
  const userId = "xyz000";
  const postId = "def456";

  const result = await UserHandler.addSavedPost(userId, postId);
  expect(result).toBe(0);

  const user = await userModel.findOne({ _id: userId });
  expect(user).toBe(null);
});

test("Deleting saved post", async () => {
  const userId = "abc123";
  const postId = "def456";

  const result = await UserHandler.deleteSavedPost(userId, postId);
  expect(result.modifiedCount).toBe(1);

  const user = await userModel.findOne({ _id: userId });
  expect(user.savedPosts.length).toBe(1);
});

test("Print user JSON", async () => {
  const id = "abc123";
  const user = await UserHandler.getUserById(id);
  expect(user).toBeDefined();
  expect(user.toJSON()).toBeDefined();
});

test("Updating user image", async () => {
  const id = "abc123";
  const photoPath = "v1234567890/fake_image.png";

  const result = await UserHandler.updateUserImageById(id, photoPath);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);

  const user = await userModel.findOne({ _id: id });
  expect(user).toBeDefined();
  expect(user.photo).toBe("v1234567890/fake_image.png");
});

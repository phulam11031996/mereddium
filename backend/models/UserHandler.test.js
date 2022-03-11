const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");
const UserHandler = require("./UserHandler");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { v4: uuidv4 } = require('uuid');

const uniqueID = () => {
	return uuidv4();
}

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

  conn = await mongoose.createConnection(uri, mongooseOpts);

  userModel = conn.model("User", UserSchema);

  DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // const postId = uniqueID().slice(0,6);
  // const newPost = { 
  //   _id: postId, 
  //   userId: "asd123", 
  //   title: "dummy title 1", 
  //   message: "dummy message 1",
  //   comments: [], 
  //   turnOnComments: true,
  //   published: true, 
  //   stringify: "req.body.stringify",
  //   tags: [],
  //   imageURL: "dummy url", 
  //   upVoteUsers: [],
  //   downVoteUsers: []
  // }
  const newUser = 
		new userModel(
			{ 
				_id: uniqueID().slice(0,6), 
				firstName: "Nick", 
				lastName: "Bayati",
				email: "nb@email.com", 
				role: "admin",
				photo: "default.jpg", 
				password: "password",
				password_confirm: "password", 
				passwordChangedAt: Date.now(),
				reset_token: uniqueID(), 
				reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
				blocked: false,
				interestedIn: []
			}
	);
  await newUser.save();
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
  const userName = "Ted Lasso";
  const users = await userServices.getUsers(userName);
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  users.forEach((user) => expect(user.name).toBe(userName));
});

test("Fetching user by email", async () => {
  const userJob = "Soccer coach";
  const users = await userServices.getUsers(undefined, userJob);
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
  users.forEach((user) => expect(user.job).toBe(userJob));
});

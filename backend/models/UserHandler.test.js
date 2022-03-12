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

  const newUser2 = 
		new userModel(
			{ 
				_id: "abc123", 
				firstName: "Marco", 
				lastName: "Polo",
				email: "marco@polo.com", 
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
  expect(user['id']).toBe(id);
});

test("Fetching user by email", async () => {
  const email = "marco@polo.com";
  const user = await UserHandler.getUserByEmail(email);
  expect(user).toBeDefined();
  expect(user['email']).toBe(email);
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
  const user =
    {
      email: "abc@email.com",
    };
  const result = await UserHandler.updateUserById(id, user);
  expect(result).toBeDefined();
  expect(result['modifiedCount']).toBe(1);  // one document was updated
});

test("Adding user", async () => {
  const user =
    {
      firstName: "A",
      lastName: "B",
      email: "abc@email.com",
      role: "admin",
      password: "password",
      password_confirm: "password",
      interestedIn: []
    };
  const result = await UserHandler.createUser(user);
  expect(result).toBeDefined();
});

test("Adding user -- already existing", async () => {
  const user =
    {
      firstName: "Marco",
      lastName: "Polo",
      email: "marco@polo.com",
      role: "admin",
      password: "password",
      password_confirm: "password", 
      interestedIn: []
    };
  await expect(UserHandler.createUser(user)).rejects
    .toThrow("E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"marco@polo.com\" }");
});

test("Print user JSON", async () => {
    const id = "abc123";
    const user = await UserHandler.getUserById(id);

    expect(user).toBeDefined();
    expect(user.toJSON()).toBeDefined();
});

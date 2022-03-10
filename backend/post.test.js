const mongoose = require("mongoose");
const UserSchema = require("./user");
const userServices = require("./user-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

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

  userServices.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const postId = uniqueID().slice(0,6);
  const newPost = { 
    _id: postId, 
    userId: "asd123", 
    title: "dummy title 1", 
    message: "dummy message 1",
    comments: [], 
    turnOnComments: true,
    published: true, 
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "dummy url", 
    upVoteUsers: [],
    downVoteUsers: []
  }
  let result = new Post(newPost);
  await result.save();

}); 

afterEach(async () => {
    await Post.deleteMany();
});

test("Fetching all users", async () => {
    const posts = await postController.getAllPosts;
    expect(posts).toBeDefined();
    expect(posts.length).toBeGreaterThan(0);
});
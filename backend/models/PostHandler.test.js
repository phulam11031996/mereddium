const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const PostSchema = require("./PostSchema");
const PostHandler = require("./PostHandler");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let mongoServer;
let postModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(uri, mongooseOpts);
  postModel = mongoose.model("Post", PostSchema);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newPost = new postModel({
    _id: "abc123",
    userId: "qwe123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0
  });
  await newPost.save();

  const newPost2 = new postModel({
    _id: uniqueID().slice(0, 6),
    userId: "asd456",
    title: "dummy title 2",
    message: "dummy message 2",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy2.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0
  });
  await newPost2.save();

  const newPost3 = new postModel({
    _id: uniqueID().slice(0, 6),
    userId: "zxc789",
    title: "dummy title 3",
    message: "dummy message 3",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy3.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0
  });
  await newPost3.save();
});

afterEach(async () => {
  await postModel.deleteMany();
});

test("Fetching all posts", async () => {
  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(3);  // 3 posts
});

test("createPost -- successful path", async () => {
  const newPost = {
    _id: uniqueID().slice(0, 6),
    userId: "qsc123",
    title: "dummy title 4",
    message: "dummy message 4",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "post.stringify",
    tags: [],
    imageURL: "https://dummy4.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 1,
  };
  const result = await PostHandler.createPost(newPost);

  expect(result).toBeTruthy();
  expect(result).toHaveProperty("_id");
  expect(result.userId).toBe(newPost.userId);
  expect(result.title).toBe(newPost.title);
  expect(result.message).toBe(newPost.message);
  expect(result.comments).toStrictEqual(newPost.comments);
  expect(result.turnOnComments).toBe(newPost.turnOnComments);
  expect(result.published).toBe(newPost.published);
  expect(result.stringify).toBe(newPost.stringify);
  expect(result.tags).toStrictEqual(newPost.tags);
  expect(result.imageURL).toBe(newPost.imageURL);
  expect(result.upVoteUsers).toStrictEqual(newPost.upVoteUsers);
  expect(result.downVoteUsers).toStrictEqual(newPost.downVoteUsers);
  expect(result.upVote).toBe(newPost.upVote);
});

test("getPostById -- successful path", async () => {
  const newPost = {
    _id: uniqueID().slice(0, 6),
    userId: "qsc123",
    title: "dummy title 4",
    message: "dummy message 4",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy4.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };
  const result = new postModel(newPost);
  await result.save();
  const foundPost = await PostHandler.getPostById(newPost._id);

  expect(foundPost).toBeDefined();
  expect(foundPost._id).toBe(newPost._id);
  expect(foundPost.userId).toBe(newPost.userId);
  expect(foundPost.title).toBe(newPost.title);
  expect(foundPost.message).toBe(newPost.message);
  expect(foundPost.comments).toStrictEqual(newPost.comments);
  expect(foundPost.turnOnComments).toBe(newPost.turnOnComments);
  expect(foundPost.published).toBe(newPost.published);
  expect(foundPost.stringify).toBe(newPost.stringify);
  expect(foundPost.tags).toStrictEqual(newPost.tags);
  expect(foundPost.imageURL).toBe(newPost.imageURL);
  expect(foundPost.upVoteUsers).toStrictEqual(newPost.upVoteUsers);
  expect(foundPost.downVoteUsers).toStrictEqual(newPost.downVoteUsers);
  expect(foundPost.upVote).toBe(newPost.upVote);
});

test("getPostById -- fail path", async () => {
  const anyId = "6132b9d47cefd0cc1916b6a9";
  const post = await PostHandler.getPostById(anyId);
  expect(post).toBeNull();
});

test("Updating post -- successful path", async () => {
  const newInfor = {
    userId: "qsc123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };
  const newInforPost = await PostHandler.updatePostById("abc123", newInfor);

  expect(newInforPost.acknowledged).toBeTruthy();
  expect(newInforPost.modifiedCount).toBe(1);
  expect(newInforPost.upsertedId).toBeNull();
  expect(newInforPost.upsertedCount).toBe(0);
  expect(newInforPost.matchedCount).toBe(1);
});

test("Updating post -- fail path", async () => {
  const newInfor = {
    userId: "qsc123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };
  const newInforPost = await PostHandler.updatePostById("invalidId", newInfor);

  expect(newInforPost.acknowledged).toBeTruthy();
  expect(newInforPost.modifiedCount).toBe(0);
  expect(newInforPost.upsertedId).toBeNull();
  expect(newInforPost.upsertedCount).toBe(0);
  expect(newInforPost.matchedCount).toBe(0);
});

test("deletePostById -- successful path", async () => {
  const result = await PostHandler.deletePostById("abc123");
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(2);  // from 3 posts to 2
});

test("deletePostById -- fail path", async () => {
  const result = await PostHandler.deletePostById("xyz000");
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);

  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(3);  // 3 posts
});

test("votePost -- upVote", async () => {
  const voteResult = await PostHandler.votePost("abc123", "qwe123", 1);

  expect(voteResult[0][0].upVoteUsers.length).toBe(1);
  expect(voteResult[1][0].downVoteUsers.length).toBe(0);
});

test("votePost -- downVote", async () => {
  const voteResult = await PostHandler.votePost("abc123", "qwe123", -1);

  expect(voteResult[0][0].upVoteUsers.length).toBe(0);
  expect(voteResult[1][0].downVoteUsers.length).toBe(1);
});

test("votePost -- null user", async () => {
  const voteResult = await PostHandler.votePost("abc123", null, 1);
  expect(voteResult).toBe(0);
});

const mongoose = require("mongoose");
const CommentSchema = require("./CommentSchema");
const CommentHandler = require("./CommentHandler");
const PostSchema = require("./PostSchema");
const PostHandler = require("./PostHandler");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { v4: uuidv4 } = require('uuid');
const HttpError = require("../utils/http-error");

const uniqueID = () => {
  return uuidv4();
}

let mongoServer;
let conn;
let commentModel;
let postModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = mongoose.createConnection(uri, mongooseOpts);

  commentModel = conn.model("Comment", CommentSchema);
  postModel = conn.model("Post", PostSchema);

  DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newComment = {
    _id: uniqueID().slice(0,6), 
    userId: "def456", 
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "First!",
    upVote: 3
  };
  let result = new commentModel(newComment);
  await result.save();

  const newComment2 = {
    _id: "abc123", 
    userId: "def456", 
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1
  };
  result = new commentModel(newComment2);
  await result.save();

  const newPost = new postModel({
    _id: "hij789",
    userId: "def456", 
    title: "dummy title 1", 
    message: "dummy message 1",
    comments: [ newComment, newComment2 ], 
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
}); 

afterEach(async () => {
  await commentModel.deleteMany();
  await postModel.deleteMany();
});

test("Fetching all comments", async () => {
  const comments = await CommentHandler.getAllComments();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(2);  // 2 comments
});

test("Adding comment", async () => {
  const comment = {
    userId: "def456",
    postId: "hij789",
    message: "Third!",
    upVote: 2
  };

  const result = await CommentHandler.createComment(comment);
  expect(result).toBeDefined();

  const comments = await commentModel.find();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(3);  // from 2 comments to 3

  const resultComment = await commentModel.findOne({ message: "Third!" });
  expect(resultComment).toBeDefined();
  expect(resultComment.upVote).toBe(2);
});

test("Fetching comment by id", async () => {
  const id = "abc123";
  const comment = await CommentHandler.getCommentById(id);
  expect(comment).toBeDefined();
  expect(comment._id).toBe(id);
  expect(comment.message).toBe("Second!");
});

test("Updating comment by id", async () => {
  const id = "abc123";
  const comment = { upVote: -2 };  // change upvotes from 1 to -2

  const result = await CommentHandler.updateCommentById(id, comment);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);  // one document was updated

  const getComment = await commentModel.findOne({ _id: id });
  expect(getComment).toBeDefined();
  expect(getComment.upVote).toBe(-2);
});

test("Deleting comment by id", async () => {
  const commentId = "abc123";
  const postId = "hij789";

  const result = await CommentHandler.deleteCommentById(commentId, postId);
  expect(result).toBe(1);  // function ran without errors
  
  const comments = await commentModel.find();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(1);  // from 2 comments to 1
  expect(comments[0]._id).not.toBe(commentId);
});

test("Deleting comment by id -- invalid comment id", async () => {
  const commentId = "xyz000";
  const postId = "hij789";

  const result = await CommentHandler.deleteCommentById(commentId, postId);
  expect(result).toBeDefined();
  expect(result).toStrictEqual(new HttpError("commentId not found!"));
});

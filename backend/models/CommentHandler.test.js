const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const CommentSchema = require("./CommentSchema");
const CommentHandler = require("./CommentHandler");
const PostSchema = require("./PostSchema");

const HttpError = require("../utils/http-error");
const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let mongoServer;
let commentModel;
let postModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(uri, mongooseOpts);
  commentModel = mongoose.model("Comment", CommentSchema);
  postModel = mongoose.model("Post", PostSchema);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newComment = new commentModel({
    _id: uniqueID().slice(0, 6),
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "First!",
    upVote: 3,
  });
  await newComment.save();

  const newComment2 = new commentModel({
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  });
  await newComment2.save();

  const newPost = new postModel({
    _id: "hij789",
    userId: "def456",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [newComment, newComment2],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
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
  expect(comments.length).toBe(2); // 2 comments
});

test("Adding comment", async () => {
  const comment = {
    userId: "def456",
    postId: "hij789",
    message: "Third!",
    upVote: 2,
  };

  const result = await CommentHandler.createComment(comment);
  expect(result).toBeDefined();
  expect(result._id).toBeDefined();
  expect(result.userId).toBe(comment.userId);
  expect(result.postId).toBe(comment.postId);
  expect(result.message).toBe(comment.message);
  expect(result.upVote).toBe(comment.upVote);

  const comments = await commentModel.find();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(3); // from 2 comments to 3
});

test("Adding comment -- incorrect postId", async () => {
  const comment = {
    userId: "def456",
    postId: "xyz000",
    message: "Third!",
    upVote: 2,
  };

  const result = await CommentHandler.createComment(comment);
  expect(result).toBeDefined();
  expect(result).toBe(0);
});

test("Fetching comment by id", async () => {
  const id = "abc123";
  const comment = await CommentHandler.getCommentById(id);
  expect(comment).toBeDefined();
  expect(comment._id).toBe(id);
  expect(comment.message).toBe("Second!");
});

test("Updating comment by id -- success", async () => {
  const id = "abc123";
  const comment = { upVote: -2 }; // change upvotes from 1 to -2

  const result = await CommentHandler.updateCommentById(id, comment);
  expect(result).toBeDefined();
  expect(result).toBe(1);

  const getComment = await commentModel.findOne({ _id: id });
  expect(getComment).toBeDefined();
  expect(getComment.upVote).toBe(-2);

  const getPost = await postModel.findOne({ _id: getComment.postId });
  expect(getPost.comments.includes(getComment)); // check if post has update comment
});

test("Updating comment by id -- success", async () => {
  const commentId = "abc123";
  const commentUpdate = { message: "Hello" };

  const result = await CommentHandler.updateCommentById(
    commentId,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(1);
});

test("Updating comment by id -- no update given", async () => {
  const commentId = "abc123";
  const commentUpdate = null;

  const result = await CommentHandler.updateCommentById(
    commentId,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(0);
});

test("Updating comment by id -- comment id not found", async () => {
  const commentId = "xyz000";
  const commentUpdate = { message: "Second!" };

  const result = await CommentHandler.updateCommentById(
    commentId,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(-1);
});

test("Updating comment by id -- comment not found in post", async () => {
  const commentId = "abc123";
  const commentUpdate = { postId: "xyz000" };

  const result = await CommentHandler.updateCommentById(
    commentId,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toStrictEqual(
    new HttpError("comment not found on post.", 404)
  );
});

test("Deleting comment by id", async () => {
  const commentId = "abc123";
  const postId = "hij789";

  const result = await CommentHandler.deleteCommentById(commentId, postId);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  const comments = await commentModel.find();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(1); // from 2 comments to 1
  expect(comments[0]._id).not.toBe(commentId);
});

test("Deleting comment by id -- invalid comment id", async () => {
  const commentId = "xyz000";
  const postId = "hij789";

  const result = await CommentHandler.deleteCommentById(commentId, postId);
  expect(result).toBeDefined();
  expect(result).toStrictEqual(new HttpError("commentId not found!", 404));
});

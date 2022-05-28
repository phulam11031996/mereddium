const mongoose = require("mongoose");
const CommentSchema = require("./CommentSchema");
const CommentHandler = require("./CommentHandler");
const PostHandler = require("./PostHandler");

// @ts-expect-error TS7016
const mockingoose = require("mockingoose");

const { v4: uuidv4 } = require("uuid");
const HttpError = require("../utils/http-error");

const uniqueID = () => {
  return uuidv4();
};

let commentModel;

beforeAll(async () => {
  commentModel = mongoose.model("Comment", CommentSchema);
});

afterAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

afterEach(async () => {});

test("Fetching all comments -- no comments stored", async () => {
  commentModel.find = jest.fn().mockResolvedValue([]);

  const result = await CommentHandler.getAllComments();
  expect(result).toBeDefined();
  expect(result.length).toBe(0); // 0 comments

  expect(commentModel.find.mock.calls.length).toBe(1);
  expect(commentModel.find).toHaveBeenCalledWith();
});

test("Fetching all comments -- 2 comments stored", async () => {
  const comments = [
    {
      _id: uniqueID().slice(0, 6),
      userId: "def456",
      postId: "hij789",
      timeStamp: Date.now(),
      lastModifiedAt: Date.now(),
      message: "First!",
      upVote: 3,
    },
    {
      _id: "abc123",
      userId: "def456",
      postId: "hij789",
      timeStamp: Date.now(),
      lastModifiedAt: Date.now(),
      message: "Second!",
      upVote: 1,
    },
  ];
  commentModel.find = jest.fn().mockResolvedValue(comments);

  const result = await CommentHandler.getAllComments();
  expect(result).toBeDefined();
  expect(result.length).toBe(2); // 2 comments

  expect(commentModel.find.mock.calls.length).toBe(1);
  expect(commentModel.find).toHaveBeenCalledWith();
});

// ------------------------------------
//       Adding Comment Tests
// ------------------------------------

test("Adding comment", async () => {
  const comment = {
    userId: "def456",
    postId: "hij789",
    message: "Third!",
    upVote: 2,
  };
  const addedComment = {
    _id: "a1b2c3",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Third!",
    upVote: 2,
  };
  mockingoose(commentModel).toReturn(addedComment, "save");
  PostHandler.addCommentByPostId = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await CommentHandler.createComment(comment);
  expect(result).toBeDefined();
  expect(result).toHaveProperty("_id");
  expect(result.userId).toBe(comment.userId);
  expect(result.postId).toBe(comment.postId);
  expect(result).toHaveProperty("timeStamp");
  expect(result).toHaveProperty("lastModifiedAt");
  expect(result.message).toBe(comment.message);
  expect(result.upVote).toBe(comment.upVote);

  expect(PostHandler.addCommentByPostId.mock.calls.length).toBe(1);
});

test("Adding comment -- incorrect postId", async () => {
  const comment = {
    userId: "def456",
    postId: "xyz000",
    message: "Third!",
    upVote: 2,
  };
  const addedComment = {
    _id: "a1b2c3",
    userId: "def456",
    postId: "xyz000",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Third!",
    upVote: 2,
  };
  mockingoose(commentModel).toReturn(addedComment, "save");
  PostHandler.addCommentByPostId = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 0,
  });
  commentModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  });

  const result = await CommentHandler.createComment(comment);
  expect(result).toBeDefined();
  expect(result).toBe(0);

  expect(PostHandler.addCommentByPostId.mock.calls.length).toBe(1);

  expect(commentModel.deleteOne.mock.calls.length).toBe(1);
  expect(commentModel.deleteOne).toHaveBeenCalledWith({
    _id: addedComment._id,
  });
});

// ------------------------------------
//    End of Adding Comment Tests
// ------------------------------------

test("Fetching comment by id", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  commentModel.findById = jest.fn().mockResolvedValue(comment);

  const result = await CommentHandler.getCommentById("abc123");
  expect(result).toBeDefined();
  expect(result._id).toBe(comment._id);
  expect(result.userId).toBe(comment.userId);
  expect(result.postId).toBe(comment.postId);
  expect(result.message).toBe(comment.message);
  expect(result.upVote).toBe(comment.upVote);

  expect(commentModel.findById.mock.calls.length).toBe(1);
  expect(commentModel.findById).toHaveBeenCalledWith({ _id: "abc123" });
});

// ------------------------------------
//       Updating Comment Tests
// ------------------------------------

test("Updating comment by id -- success", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  const commentUpdate = {
    upVote: -2, // change upvotes from 1 to -2
  };

  commentModel.findOneAndUpdate = jest.fn().mockResolvedValue({
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: -2,
  });

  PostHandler.updateCommentByPostId = jest.fn().mockResolvedValue(1);

  const result = await CommentHandler.updateCommentById(
    comment._id,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(1);

  expect(commentModel.findOneAndUpdate.mock.calls.length).toBe(1);
  expect(commentModel.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: comment._id },
    { $set: commentUpdate },
    { new: true }
  );

  expect(PostHandler.updateCommentByPostId.mock.calls.length).toBe(1);
  expect(PostHandler.updateCommentByPostId).toHaveBeenCalledWith(
    comment._id,
    comment.postId,
    commentUpdate
  );
});

test("Updating comment by id -- success", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  const commentUpdate = { message: "Hello" };

  commentModel.findOneAndUpdate = jest.fn().mockResolvedValue({
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Hello",
    upVote: 1,
  });

  PostHandler.updateCommentByPostId = jest.fn().mockResolvedValue(1);

  const result = await CommentHandler.updateCommentById(
    comment._id,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(1);

  expect(commentModel.findOneAndUpdate.mock.calls.length).toBe(1);
  expect(commentModel.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: comment._id },
    { $set: commentUpdate },
    { new: true }
  );

  expect(PostHandler.updateCommentByPostId.mock.calls.length).toBe(1);
  expect(PostHandler.updateCommentByPostId).toHaveBeenCalledWith(
    comment._id,
    comment.postId,
    commentUpdate
  );
});

test("Updating comment by id -- no update given", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  const commentUpdate = null;

  const result = await CommentHandler.updateCommentById(
    comment._id,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(0);
});

test("Updating comment by id -- comment id not found", async () => {
  const commentId = "xyz000";
  const commentUpdate = { message: "Hello" };

  commentModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

  const result = await CommentHandler.updateCommentById(
    commentId,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(-1);

  expect(commentModel.findOneAndUpdate.mock.calls.length).toBe(1);
  expect(commentModel.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: commentId },
    { $set: commentUpdate },
    { new: true }
  );
});

test("Updating comment by id -- comment not found in post", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  const commentUpdate = { postId: "xyz000" };

  commentModel.findOneAndUpdate = jest.fn().mockResolvedValue({
    _id: "abc123",
    userId: "def456",
    postId: "xyz000",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Hello",
    upVote: 1,
  });

  PostHandler.updateCommentByPostId = jest.fn().mockImplementation(() => {
    throw new HttpError("comment not found on post.", 404);
  });

  const result = await CommentHandler.updateCommentById(
    comment._id,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toStrictEqual(
    new HttpError("comment not found on post.", 404)
  );

  expect(commentModel.findOneAndUpdate.mock.calls.length).toBe(1);
  expect(commentModel.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: comment._id },
    { $set: commentUpdate },
    { new: true }
  );

  expect(PostHandler.updateCommentByPostId.mock.calls.length).toBe(1);
  expect(PostHandler.updateCommentByPostId).toHaveBeenCalledWith(
    comment._id,
    commentUpdate.postId,
    commentUpdate
  );
});

// ------------------------------------
//       Deleting Comment Tests
// ------------------------------------

test("Deleting comment by id", async () => {
  const comment = {
    _id: "abc123",
    userId: "def456",
    postId: "hij789",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "Second!",
    upVote: 1,
  };
  commentModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  });
  PostHandler.deleteCommentByPostId = jest.fn().mockResolvedValue(1);

  const result = await CommentHandler.deleteCommentById(
    comment._id,
    comment.postId
  );
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  expect(commentModel.deleteOne.mock.calls.length).toBe(1);
  expect(commentModel.deleteOne).toHaveBeenCalledWith({ _id: comment._id });

  expect(PostHandler.deleteCommentByPostId.mock.calls.length).toBe(1);
  expect(PostHandler.deleteCommentByPostId).toHaveBeenCalledWith(
    comment._id,
    comment.postId
  );
});

test("Deleting comment by id -- incorrect commentId", async () => {
  const commentId = "xyz000";
  const postId = "hij789";
  PostHandler.deleteCommentByPostId = jest.fn().mockImplementation(() => {
    throw new HttpError("commentId not found!", 404);
  });

  const result = await CommentHandler.deleteCommentById(commentId, postId);
  expect(result).toBeDefined();
  expect(result).toStrictEqual(new HttpError("commentId not found!", 404));

  expect(PostHandler.deleteCommentByPostId.mock.calls.length).toBe(1);
  expect(PostHandler.deleteCommentByPostId).toHaveBeenCalledWith(
    commentId,
    postId
  );
});

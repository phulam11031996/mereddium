const mongoose = require("mongoose");
const PostSchema = require("./PostSchema");
const PostHandler = require("./PostHandler");

// @ts-expect-error TS7016
const mockingoose = require("mockingoose");

const HttpError = require("../utils/http-error");
const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let postModel;

beforeAll(async () => {
  postModel = mongoose.model("Post", PostSchema);
});

afterAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

afterEach(async () => {});

test("Fetching all posts -- no posts stored", async () => {
  postModel.find = jest.fn().mockResolvedValue([]);

  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(0); // 0 posts

  expect(postModel.find.mock.calls.length).toBe(1);
  expect(postModel.find).toHaveBeenCalledWith();
});

test("Fetching all posts -- 2 posts stored", async () => {
  const result = [
    {
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
      upVote: 0,
    },
    {
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
      upVote: 0,
    },
  ];
  postModel.find = jest.fn().mockResolvedValue(result);

  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(2); // 2 posts

  expect(postModel.find.mock.calls.length).toBe(1);
  expect(postModel.find).toHaveBeenCalledWith();
});

test("Adding post", async () => {
  const post = {
    userId: "zxc789",
    title: "dummy title 3",
    message: "dummy message 3",
    imageURL: "https://dummy3.url",
  };
  const addedPost = {
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
    upVote: 0,
  };
  mockingoose(postModel).toReturn(addedPost, "save");

  const result = await PostHandler.createPost(post);
  expect(result).toBeDefined();
  expect(result).toHaveProperty("_id");
  expect(result.userId).toBe(post.userId);
  expect(result.title).toBe(post.title);
  expect(result.message).toBe(post.message);
  expect(result).toHaveProperty("comments");
  expect(result).toHaveProperty("turnOnComments");
  expect(result).toHaveProperty("published");
  expect(result).toHaveProperty("stringify");
  expect(result).toHaveProperty("tags");
  expect(result.imageURL).toBe(post.imageURL);
  expect(result).toHaveProperty("upVoteUsers");
  expect(result).toHaveProperty("downVoteUsers");
  expect(result.upVote).toBe(addedPost.upVote);
});

test("Fetching post by id", async () => {
  const post = {
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
    upVote: 0,
  };
  postModel.findById = jest.fn().mockResolvedValue(post);

  const foundPost = await PostHandler.getPostById("abc123");
  expect(foundPost._id).toBeDefined();
  expect(foundPost.userId).toBe(post.userId);
  expect(foundPost.title).toBe(post.title);
  expect(foundPost.message).toBe(post.message);
  expect(foundPost.imageURL).toBe(post.imageURL);
  expect(foundPost.published).toBeTruthy();
  expect(foundPost.upVote).toBe(post.upVote);

  expect(postModel.findById.mock.calls.length).toBe(1);
  expect(postModel.findById).toHaveBeenCalledWith({ _id: "abc123" });
});

test("Updating post by id", async () => {
  const post = {
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
    upVote: 0,
  };
  const postUpdate = {
    upVote: 5, // change upvotes from 0 to 4
  };
  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await PostHandler.updatePostById(post._id, postUpdate);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1); // one document was updated

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id },
    { $set: postUpdate }
  );
});

test("Deleting post by id", async () => {
  const post = {
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
    upVote: 0,
  };
  postModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  });

  const result = await PostHandler.deletePostById(post._id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  expect(postModel.deleteOne.mock.calls.length).toBe(1);
  expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: post._id });
});

test("Deleting post by id -- post not found", async () => {
  const id = "xyz000";
  postModel.deleteOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 0,
  });

  const result = await PostHandler.deletePostById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);

  expect(postModel.deleteOne.mock.calls.length).toBe(1);
  expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: id });
});

// ------------------------------------
//        Post Comments Tests
// ------------------------------------

test("Adding comment to post", async () => {
  const post = {
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
    upVote: 0,
  };
  const comment = {
    _id: uniqueID().slice(0, 6),
    userId: "def456",
    postId: "abc123",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "First!",
    upVote: 3,
  };

  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await PostHandler.addCommentByPostId(post._id, comment);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id },
    { $push: { comments: comment } }
  );
});

test("Updating a comment on post -- success", async () => {
  const comment = {
    _id: "xyz000",
    userId: "def456",
    postId: "abc123",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "First!",
    upVote: 3,
  };
  const post = {
    _id: "abc123",
    userId: "qwe123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [comment],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };
  commentUpdate = { upVote: -2 };

  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await PostHandler.updateCommentByPostId(
    comment._id,
    post._id,
    commentUpdate
  );
  expect(result).toBeDefined();
  expect(result).toBe(1);

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id, comments: { $elemMatch: { _id: comment._id } } },
    { $set: commentUpdate }
  );
});

test("Updating a comment on post -- comment not found", async () => {
  const comment = {
    _id: "xyz000",
    userId: "def456",
    postId: "abc123",
    timeStamp: Date.now(),
    lastModifiedAt: Date.now(),
    message: "First!",
    upVote: 3,
  };
  const post = {
    _id: "abc123",
    userId: "qwe123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [], // no comments on post
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };
  commentUpdate = { upVote: -2 };

  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 0,
  });

  await expect(
    PostHandler.updateCommentByPostId(comment._id, post._id, commentUpdate)
  ).rejects.toThrowError(new HttpError("comment not found on post.", 404));

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id, comments: { $elemMatch: { _id: comment._id } } },
    { $set: commentUpdate }
  );
});

test("Deleting comment from post", async () => {
  const post = {
    _id: "abc123",
    userId: "qwe123",
    title: "dummy title 1",
    message: "dummy message 1",
    comments: [
      {
        _id: "xyz000",
        userId: "def456",
        postId: "abc123",
        timeStamp: Date.now(),
        lastModifiedAt: Date.now(),
        message: "First!",
        upVote: 3,
      },
    ],
    turnOnComments: true,
    published: true,
    stringify: "req.body.stringify",
    tags: [],
    imageURL: "https://dummy1.url",
    upVoteUsers: [],
    downVoteUsers: [],
    upVote: 0,
  };

  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  });

  const result = await PostHandler.deleteCommentByPostId("xyz000", post._id);
  expect(result).toBeDefined();
  expect(result).toBe(1);

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id },
    { $pull: { comments: { _id: "xyz000" } } }
  );
});

test("Deleting comment from post -- commentId not found", async () => {
  const post = {
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
    upVote: 0,
  };

  postModel.updateOne = jest.fn().mockResolvedValue({
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 0,
  });

  await expect(
    PostHandler.deleteCommentByPostId("xyz000", post._id)
  ).rejects.toThrowError(new HttpError("commentId not found!", 404));

  expect(postModel.updateOne.mock.calls.length).toBe(1);
  expect(postModel.updateOne).toHaveBeenCalledWith(
    { _id: post._id },
    { $pull: { comments: { _id: "xyz000" } } }
  );
});

// ------------------------------------
//          Vote Post Tests
// ------------------------------------

test("votePost -- upVote", async () => {
  const post = {
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
    upVote: 0,
  };

  const noUpdateResult = {
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 0,
  };
  const updateResult = {
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  };
  postModel.updateOne = jest
    .fn()
    .mockResolvedValueOnce(noUpdateResult)
    .mockResolvedValueOnce(noUpdateResult)
    .mockResolvedValueOnce(updateResult);

  postModel.find = jest
    .fn()
    .mockResolvedValueOnce([{ userId: "qwe123" }])
    .mockResolvedValueOnce([]);

  const voteResult = await PostHandler.votePost(post._id, "qwe123", 1);
  expect(voteResult).toBeDefined();
  // upVoteUsers should have one object
  expect(voteResult[0].length).toBe(1);
  expect(voteResult[0][0]).toStrictEqual({ userId: "qwe123" });
  // downVoteUsers should be empty
  expect(voteResult[1].length).toBe(0);

  expect(postModel.updateOne.mock.calls.length).toBe(3);
  expect(postModel.updateOne.mock.calls[0]).toEqual([
    { _id: post._id },
    { $pull: { upVoteUsers: { userId: "qwe123" } } },
  ]);
  expect(postModel.updateOne.mock.calls[1]).toEqual([
    { _id: post._id },
    { $pull: { downVoteUsers: { userId: "qwe123" } } },
  ]);
  expect(postModel.updateOne.mock.calls[2]).toEqual([
    { _id: post._id },
    { $push: { upVoteUsers: { userId: "qwe123" } } },
  ]);

  expect(postModel.find.mock.calls.length).toBe(2);
  expect(postModel.find.mock.calls[0]).toEqual([
    { _id: post._id },
    { upVoteUsers: 1, _id: 0 },
  ]);
  expect(postModel.find.mock.calls[1]).toEqual([
    { _id: post._id },
    { downVoteUsers: 1, _id: 0 },
  ]);
});

test("votePost -- downVote", async () => {
  const post = {
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
    upVote: 0,
  };

  const noUpdateResult = {
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 0,
  };
  const updateResult = {
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1,
  };
  postModel.updateOne = jest
    .fn()
    .mockResolvedValueOnce(noUpdateResult)
    .mockResolvedValueOnce(noUpdateResult)
    .mockResolvedValueOnce(updateResult);

  postModel.find = jest
    .fn()
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([{ userId: "qwe123" }]);

  const voteResult = await PostHandler.votePost(post._id, "qwe123", -1);
  expect(voteResult).toBeDefined();
  // upVoteUsers should be empty
  expect(voteResult[0].length).toBe(0);
  // downVoteUsers should have one object
  expect(voteResult[1].length).toBe(1);
  expect(voteResult[1][0]).toStrictEqual({ userId: "qwe123" });

  expect(postModel.updateOne.mock.calls.length).toBe(3);
  expect(postModel.updateOne.mock.calls[0]).toEqual([
    { _id: post._id },
    { $pull: { upVoteUsers: { userId: "qwe123" } } },
  ]);
  expect(postModel.updateOne.mock.calls[1]).toEqual([
    { _id: post._id },
    { $pull: { downVoteUsers: { userId: "qwe123" } } },
  ]);
  expect(postModel.updateOne.mock.calls[2]).toEqual([
    { _id: post._id },
    { $push: { downVoteUsers: { userId: "qwe123" } } },
  ]);

  expect(postModel.find.mock.calls.length).toBe(2);
  expect(postModel.find.mock.calls[0]).toEqual([
    { _id: post._id },
    { upVoteUsers: 1, _id: 0 },
  ]);
  expect(postModel.find.mock.calls[1]).toEqual([
    { _id: post._id },
    { downVoteUsers: 1, _id: 0 },
  ]);
});

test("votePost -- null user", async () => {
  const voteResult = await PostHandler.votePost("abc123", null, 1);
  expect(voteResult).toBe(0);
});

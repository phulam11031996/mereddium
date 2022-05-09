const mongoose = require("mongoose");
const PostSchema = require("./PostSchema");
const PostHandler = require("./PostHandler");

// @ts-expect-error TS7016
const mockingoose = require("mockingoose");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let postModel;

beforeAll(async () => {
    postModel = mongoose.model("Post", PostSchema);
});

afterAll(async () => {

});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});
  
afterEach(async () => {

});

test("Fetching all posts -- no posts stored", async () => {
  postModel.find = jest.fn().mockResolvedValue([]);
  
  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(0);  // 0 posts

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
      upVote: 0
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
      upVote: 0
    }
  ];
  postModel.find = jest.fn().mockResolvedValue(result);
  
  const posts = await PostHandler.getAllPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBe(2);  // 2 posts

  expect(postModel.find.mock.calls.length).toBe(1);
  expect(postModel.find).toHaveBeenCalledWith();
});

test("Adding post", async () => {
  const post = {
    userId: "zxc789",
    title: "dummy title 3",
    message: "dummy message 3",
    imageURL: "https://dummy3.url"
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
    upVote: 0
  };
  mockingoose(postModel).toReturn(addedPost, 'save');

  const result = await PostHandler.createPost(post);
  expect(result).toBeDefined();
  expect(result._id).toBeDefined();
  expect(result.userId).toBe(post.userId);
  expect(result.title).toBe(post.title);
  expect(result.message).toBe(post.message);
  expect(result.imageURL).toBe(post.imageURL);
  expect(result.published).toBeTruthy();
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
    upVote: 0
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
    upVote: 0
  };
  const postUpdate = {
    upVote: 5,  // change upvotes from 0 to 4
  };
  postModel.updateOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1
    }
  );

  const result = await PostHandler.updatePostById(post._id, postUpdate);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1);  // one document was updated

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
    upVote: 0
  };
  postModel.deleteOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      deletedCount: 1
    }
  );
  
  const result = await PostHandler.deletePostById(post._id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  expect(postModel.deleteOne.mock.calls.length).toBe(1);
  expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: post._id });
});

test("Deleting post by id -- post not found", async () => {
  const id = "xyz000";
  postModel.deleteOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      deletedCount: 0
    }
  );

  const result = await PostHandler.deletePostById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);

  expect(postModel.deleteOne.mock.calls.length).toBe(1);
  expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: id });
});

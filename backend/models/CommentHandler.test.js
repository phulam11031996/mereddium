const mongoose = require("mongoose");
const CommentSchema = require("./CommentSchema");
const CommentHandler = require("./CommentHandler");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { v4: uuidv4 } = require('uuid');

const uniqueID = () => {
    return uuidv4();
}

let mongoServer;
let conn;
let commentModel;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    conn = await mongoose.createConnection(uri, mongooseOpts);

    commentModel = conn.model("Comment", CommentSchema);

    DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    const newComment = 
		new commentModel(
            {
                _id: uniqueID().slice(0,6), 
                userId: "def456", 
                postId: "hij789",
                message: "First!",
                upVote: 3
            }
	);
    await newComment.save();

    const newComment2 = 
		new commentModel(
            {
                _id: "abc123", 
                userId: "def456", 
                postId: "hij789",
                message: "Second!",
                upVote: 1
            }
	);
    await newComment2.save();
}); 

afterEach(async () => {
  await commentModel.deleteMany();
});

test("Fetching all comments", async () => {
  const comments = await CommentHandler.getAllComments();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(2);  // 2 comments
});

test("Fetching comment by id", async () => {
  const id = "abc123";
  const comment = await CommentHandler.getCommentById(id);
  expect(comment).toBeDefined();
  expect(comment['id']).toBe(id);
});

test("Deleting comment by id", async () => {
  const id = "abc123";
  await CommentHandler.deleteCommentById(id);
  const comments = await CommentHandler.getAllComments();
  expect(comments).toBeDefined();
  expect(comments.length).toBe(1);  // from 2 comments to 1
});

test("Updating comment by id", async () => {
    const id = "abc123";
    const comment =
        {
            upVote: -2,  // change upvotes from 1 to -2
        };
  
    const result = await CommentHandler.updateCommentById(id, comment);
    expect(result).toBeDefined();
    expect(result['modifiedCount']).toBe(1);  // one document was updated

    const getComment = await CommentHandler.getCommentById(id);
    expect(getComment).toBeDefined();
    expect(getComment['upVote']).toBe(-2);
});

test("Adding comment", async () => {
    const comment =
        {
            userId: "def456",
            postId: "hij789",
            message: "Third!",
            upVote: 1
        };
    
    const result = await CommentHandler.createComment(comment);
    expect(result).toBeDefined();

    const comments = await CommentHandler.getAllComments();
    expect(comments).toBeDefined();
    expect(comments.length).toBe(3);  // from 2 comments to 3
});

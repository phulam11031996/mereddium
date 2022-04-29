const mongoose = require("mongoose");
const TagSchema = require("./TagSchema");
const TagHandler = require("./TagHandler");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let mongoServer;
let conn;
let tagModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  tagModel = conn.model("Tag", TagSchema);

  DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newTag = new tagModel({
    _id: uniqueID().slice(0, 6),
    name: "Technology",
  });
  await newTag.save();

  const newTag2 = new tagModel({
    _id: "abc123",
    name: "Education",
  });
  await newTag2.save();
});

afterEach(async () => {
  await tagModel.deleteMany();
});

test("Fetching all tags", async () => {
  const tags = await TagHandler.getAllTags();
  expect(tags).toBeDefined();
  expect(tags.length).toBe(2); // 2 tags
});

test("Fetching tag by id", async () => {
  const id = "abc123";
  const tag = await TagHandler.getTagById(id);
  expect(tag).toBeDefined();
  expect(tag["id"]).toBe(id);
});

test("Deleting tag by id", async () => {
  const id = "abc123";
  await TagHandler.deleteTagById(id);
  const tags = await TagHandler.getAllTags();
  expect(tags).toBeDefined();
  expect(tags.length).toBe(1); // from 2 tags to 1
});

test("Updating tag by id", async () => {
  const id = "abc123";
  const tag = {
    name: "Numbers", // change name from "Education" to "Numbers"
  };

  const result = await TagHandler.updateTagById(id, tag);
  expect(result).toBeDefined();
  expect(result["modifiedCount"]).toBe(1); // one document was updated

  const getTag = await TagHandler.getTagById(id);
  expect(getTag).toBeDefined();
  expect(getTag["name"]).toBe("Numbers");
});

test("Adding tag", async () => {
  const tag = {
    name: "Computers",
  };

  const result = await TagHandler.createTag(tag);
  expect(result).toBeDefined();

  const tags = await TagHandler.getAllTags();
  expect(tags).toBeDefined();
  expect(tags.length).toBe(3); // from 2 tags to 3
});

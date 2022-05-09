const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const TagSchema = require("./TagSchema");
const TagHandler = require("./TagHandler");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let mongoServer;
let tagModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  mongoose.connect(uri, mongooseOpts);
  tagModel = mongoose.model("Tag", TagSchema);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const newTag = new tagModel({
    _id: uniqueID().slice(0, 6),
    name: "Technology"
  });
  await newTag.save();

  const newTag2 = new tagModel({
    _id: "abc123",
    name: "Education"
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

test("Adding tag", async () => {
  const tag = {
    name: "Computers",
  };

  const result = await TagHandler.createTag(tag);
  expect(result).toBeDefined();

  const getTag = await tagModel.findOne({ name: tag.name });
  expect(getTag).toBeDefined();
  expect(getTag.name).toBe(tag.name);
});

test("Fetching tag by id", async () => {
  const id = "abc123";
  const tag = await TagHandler.getTagById(id);
  expect(tag).toBeDefined();
  expect(tag._id).toBe(id);
});

test("Updating tag by id", async () => {
  const id = "abc123";
  const tag = {
    name: "Numbers", // change name from "Education" to "Numbers"
  };

  const result = await TagHandler.updateTagById(id, tag);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1); // one document was updated

  const getTag = await tagModel.findById(id);
  expect(getTag).toBeDefined();
  expect(getTag.name).toBe("Numbers");
});

test("Deleting tag by id", async () => {
  const id = "abc123";
  
  const result = await TagHandler.deleteTagById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);
});

test("Deleting tag by id -- tag not found", async () => {
  const id = "xyz000";
  
  const result = await TagHandler.deleteTagById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);
});

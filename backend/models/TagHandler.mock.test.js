const mongoose = require("mongoose");
const TagSchema = require("./TagSchema");
const TagHandler = require("./TagHandler");

// @ts-expect-error TS7016
const mockingoose = require("mockingoose");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

let tagModel;

beforeAll(async () => {
  tagModel = mongoose.model("Tag", TagSchema);
});

afterAll(async () => {

});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});
  
afterEach(async () => {

});

test("Fetching all tags -- no tags stored", async () => {
  tagModel.find = jest.fn().mockResolvedValue([]);
  
  const tags = await TagHandler.getAllTags();
  expect(tags).toBeDefined();
  expect(tags.length).toBe(0); // 0 tags

  expect(tagModel.find.mock.calls.length).toBe(1);
  expect(tagModel.find).toHaveBeenCalledWith();
});

test("Fetching all tags -- 2 tags stored", async () => {
  const result = [
    {
      _id: uniqueID().slice(0, 6),
      name: "Technology"
    },
    {
      _id: "abc123",
      name: "Education"
    }
  ];
  tagModel.find = jest.fn().mockResolvedValue(result);
  
  const tags = await TagHandler.getAllTags();
  expect(tags).toBeDefined();
  expect(tags.length).toBe(2); // 2 tags

  expect(tagModel.find.mock.calls.length).toBe(1);
  expect(tagModel.find).toHaveBeenCalledWith();
});

test("Adding tag", async () => {
  const tag = { name: "Computers" };
  const addedTag = {
    _id: "abc123",
    name: "Computers"
  };
  mockingoose(tagModel).toReturn(addedTag, 'save');

  const result = await TagHandler.createTag(tag);
  expect(result).toBeDefined();
  expect(result.name).toBe(addedTag.name);
});

test("Fetching tag by id", async () => {
  const tag = {
    _id: "abc123",
    name: "Education"
  };
  tagModel.findById = jest.fn().mockResolvedValue(tag);

  const foundTag = await TagHandler.getTagById(tag._id);
  expect(foundTag).toBeDefined();
  expect(foundTag._id).toBe(tag._id);
  expect(foundTag.name).toBe(tag.name);

  expect(tagModel.findById.mock.calls.length).toBe(1);
  expect(tagModel.findById).toHaveBeenCalledWith({ _id: tag._id });
});

test("Updating tag by id", async () => {
  const tag = {
    _id: "abc123",
    name: "Education"
  };
  const tagUpdate = {
    name: "Numbers", // change name from "Education" to "Numbers"
  };
  tagModel.updateOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1
    }
  );

  const result = await TagHandler.updateTagById(tag._id, tagUpdate);
  expect(result).toBeDefined();
  expect(result.modifiedCount).toBe(1); // one document was updated

  expect(tagModel.updateOne.mock.calls.length).toBe(1);
  expect(tagModel.updateOne).toHaveBeenCalledWith(
    { _id: tag._id },
    { $set: tagUpdate }
  );
});

test("Deleting tag by id", async () => {
  const tag = {
    _id: "abc123",
    name: "Education"
  };
  tagModel.deleteOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      deletedCount: 1
    }
  );
  
  const result = await TagHandler.deleteTagById(tag._id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(1);

  expect(tagModel.deleteOne.mock.calls.length).toBe(1);
  expect(tagModel.deleteOne).toHaveBeenCalledWith({ _id: tag._id });
});

test("Deleting tag by id -- tag not found", async () => {
  const id = "xyz000";
  tagModel.deleteOne = jest.fn().mockResolvedValue(
    {
      acknowledged: true,
      deletedCount: 0
    }
  );

  const result = await TagHandler.deleteTagById(id);
  expect(result).toBeDefined();
  expect(result.deletedCount).toBe(0);

  expect(tagModel.deleteOne.mock.calls.length).toBe(1);
  expect(tagModel.deleteOne).toHaveBeenCalledWith({ _id: id });
});

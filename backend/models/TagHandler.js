const mongoose = require("mongoose");
const TagSchema = require("./TagSchema");

const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

// GET /tag/
async function getAllTags() {
  const tagModel = mongoose.model("Tag", TagSchema);

  const tags = await tagModel.find();
  return tags;
}

// POST /tag/
async function createTag(tag) {
  const tagModel = mongoose.model("Tag", TagSchema);

  const tagId = uniqueID().slice(0, 6);

  const newTag = new tagModel({
    _id: tagId,
    name: tag.name,
  });

  const result = await newTag.save();
  return result;
}

// GET /tag/{id}
async function getTagById(id) {
  const tagModel = mongoose.model("Tag", TagSchema);

  const tag = await tagModel.findById({ _id: id });
  return tag;
}

// UPDATE /tag/{id}
async function updateTagById(id, newInfo) {
  const tagModel = mongoose.model("Tag", TagSchema);

  const result = await tagModel.updateOne(
    { _id: id },
    {
      $set: newInfo,
    }
  );

  return result;
}

// DELETE /tag/{id}
async function deleteTagById(id) {
  const tagModel = mongoose.model("Tag", TagSchema);

  const result = await tagModel.deleteOne({ _id: id });
  return result;
}

module.exports = {
  getAllTags,
  createTag,
  getTagById,
  updateTagById,
  deleteTagById
};

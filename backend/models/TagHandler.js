const DatabaseHandler = require("./DatabaseHandler");
const TagSchema = require("./TagSchema");

const { v4: uuidv4 } = require('uuid');

const uniqueID = () => {
	return uuidv4();
}

// GET /tag/
async function getAllTags() {
	const db = await DatabaseHandler.getDbConnection();
	const tagModel = db.model('Tag', TagSchema);

	const allTags = await tagModel.find();
	return allTags;
}

// POST /tag/
async function createTag(tag){
	const db = await DatabaseHandler.getDbConnection();
	const tagModel = db.model('Tag', TagSchema);

	const tagId = uniqueID().slice(0,6);
	
	const newTag = 
		new tagModel(
			{ 
				_id: tagId, 
				name: tag.name,
			}
		);
	
	newTag.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	return newTag;
}

// GET /tag/{id}
async function getTagById(id){
	const db = await DatabaseHandler.getDbConnection();
	const tagModel = db.model('Tag', TagSchema);

	const tag = await tagModel.findById({'_id': id});
  return tag;
}

// UPDATE /tag/{id}
async function updateTagById(id, newInfo){
	const db = await DatabaseHandler.getDbConnection();
	const tagModel = db.model('Tag', TagSchema);

	const updatedTag = await tagModel.updateOne({'_id': id}, {
		$set: newInfo,
	});
  return updatedTag;
}

// DELETE /tag/{id}
async function deleteTagById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const tagModel = db.model('Tag', TagSchema);

	tagModel.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
			return 0;
		} else {
			console.log(`Deleted user: ${id}`);
			return 1;
		}
	})
}

module.exports = {
	getAllTags,
	createTag,
	getTagById,
	updateTagById,
	deleteTagById,
}

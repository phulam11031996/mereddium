const Tag = require("../models/TagSchema");
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// GET /tag/
exports.getAllTags = catchAsync(async (req, res) => {
	const allTags = await Tag.find();
	res.status(200).json({
	  status: 'success',
	  data: allTags
	});
});

// POST /tag/
exports.createTag = catchAsync(async (req, res) => {
	const result = req.body;
	var token = uniqueID();
	result._id = uniqueID().slice(0,6);
	
	const newTag = 
		new Tag(
			{ 
				_id: result._id, 
				name: req.body.name, 
			}
		);
	
	newTag.save(function (err) {
		if(err) {
			console.log(err);
		}
	});

	res.status(201).json({
		result
	  });

});


// GET /tag/{id}
exports.getTagById = catchAsync(async (req, res) => {
	const id = req.params.id;
	const tag = await Tag.findById({'_id': id});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		tag,
	  },
	});
});

// UPDATE /tag/{id}
exports.updateTagById = catchAsync(async (req, res) => {
	const id = req.params.id;
	
	const tag = await Tag.updateOne({'_id': id}, {
		$set: req.body,
	});
  
	res.status(200).json({
	  status: 'success',
	  data: {
		tag,
	  },
	});
});

// DELETE /tag/{id}
exports.deleteTagById = catchAsync(async (req, res) => {
	const id = req.params.id;
	Tag.deleteOne({ _id: id}, function (err) {
		if(err) {
			console.log("Failed to delete");
		} else {
			console.log(`Deleted tag: ${id}`);
			res.status(200).send(id).end();
		}
	})
});


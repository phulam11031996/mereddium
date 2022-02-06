const mongoose = require("mongoose");

// Creating Tag Schema
const tagSchema = new mongoose.Schema({
	_id: {
		type: Number,
		required: true,
	},
	name: {
	  type: String,
	  required: [true, 'Please, specify Tag Name'],
	}
		
  });

// Creating Model with Schema tourSchema
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;


const mongoose = require("mongoose");

// Creating Tag Schema
const tagSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please, specify Tag Name"],
  },
});

module.exports = tagSchema;

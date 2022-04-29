const mongoose = require("mongoose");

// Creating Post Schema
const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  title: {
    type: String,
    required: [true, "A title is required"],
    minlength: 1,
  },
  message: {
    type: String,
    required: [true, "Please enter content"],
    minlength: 1,
  },
  imageURL: {
    type: String,
    default: null,
  },
  comments: [
    {
      _id: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      postId: {
        type: String,
        required: true,
      },
      timeStamp: {
        type: Date,
        default: Date.now(),
      },
      lastModifiedAt: {
        type: Date,
      },
      message: {
        type: String,
        required: [true, "Please enter comment"],
      },
      upVote: {
        type: Number,
        default: 1,
      },
    },
  ],
  turnOnComments: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Boolean,
    default: true,
  },
  lastModifiedAt: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  stringify: String,
  tags: [
    {
      tagId: {
        type: Number,
        required: [true, "Please enter valid tagID"],
      },
    },
  ],
  upVoteUsers: [
    {
      userId: {
        type: String,
        required: [true],
      },
    },
  ],
  downVoteUsers: [
    {
      userId: {
        type: String,
        required: [true],
      },
    },
  ],
  upVote: {
    type: Number,
    default: 1,
  },
});

module.exports = postSchema;

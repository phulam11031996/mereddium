const mongoose = require("mongoose");
const validator = require("validator");

// Creating User Schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "A person should have First Name"],
    },
    lastName: {
      type: String,
      required: [true, "A person should have Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email address"],
      unique: true,
      lowercase: true, // convert to lowerCase
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "blogger", "admin"],
      default: "user",
    },
    photo: {
      type: String,
      default: "v1650339103/default_ogjbtr.png",
    },
    password: {
      type: String,
      required: [true, "Please enter valid password"],
      minlength: 8,
    },
    password_confirm: {
      type: String,
      required: [true, "Please re-enter password to confirm and match"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Password is not the same!",
      },
      select: false,
    },
    password_bcrypt: {
      type: String,
      required: [true, "Please enter valid password"],
    },
    passwordChangedAt: {
      type: Date,
    },
    reset_token: String,
    reset_token_ext: Date,
    blocked: {
      type: Boolean,
      default: true,
      select: false,
    },
    interestedIn: [
      {
        tagId: {
          type: Number,
          required: [true, "Please enter valid tagID"],
        },
      },
    ],
    savedPosts: [
      {
        _id: {
          type: String,
        },
        postId: {
          type: String,
          required: [true, "Please enter valid postID"],
        },
        dateSaved: {
          type: Date,
          default: function () {
            return Date.now();
          },
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        // ret.id = ret._id;
        // delete ret._id
        delete ret.__v;
      },
    },
  }
);

module.exports = userSchema;

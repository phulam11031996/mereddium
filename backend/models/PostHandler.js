const mongoose = require("mongoose");
const PostSchema = require("./PostSchema");

const HttpError = require("../utils/http-error");
const { v4: uuidv4 } = require("uuid");

const uniqueID = () => {
  return uuidv4();
};

// GET /post/
async function getAllPosts() {
  const postModel = mongoose.model("Post", PostSchema);

  let posts = await postModel.find();
  return posts;
}

// POST /post/
async function createPost(post) {
  const postModel = mongoose.model("Post", PostSchema);

  const postId = uniqueID().slice(0, 6);

  const newPost = new postModel({
    _id: postId,
    userId: post.userId,
    title: post.title,
    message: post.message,
    comments: [],
    turnOnComments: true,
    published: true,
    stringify: "post.stringify",
    tags: [],
    imageURL: post.imageURL,
    upVoteUsers: [],
    downVoteUsers: [],
  });

  const result = await newPost.save();

  return result;
}

// GET /post/{id}
async function getPostById(id) {
  const postModel = mongoose.model("Post", PostSchema);

  const post = await postModel.findById({ _id: id });
  return post;
}

// UPDATE /post/{id}
async function updatePostById(id, newInfo) {
  const postModel = mongoose.model("Post", PostSchema);

  const result = await postModel.updateOne({ _id: id }, { $set: newInfo });

  return result;
}

// UPDATE /post/comment/{id}
async function addCommentByPostId(id, newComment) {
  const postModel = mongoose.model("Post", PostSchema);

  const result = await postModel.updateOne(
    { _id: id },
    { $push: { comments: newComment } }
  );

  return result;
}

// UPDATE /post/comment/{id}
async function updateCommentByPostId(comment) {
  const postModel = mongoose.model("Post", PostSchema);

  const result = await postModel.updateOne(
    { "comments._id": comment._id },
    { "comments.$": comment }
  );

  if (result.modifiedCount === 1 && result.matchedCount === 1) {
    return 1;
  } else {
    throw new HttpError("comment not found on post.", 404);
  }
}

// DELETE /post/comment/{id}
async function deleteCommentByPostId(commentId, postId) {
  const postModel = mongoose.model("Post", PostSchema);

  const post = await postModel.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

  if (post.modifiedCount === 1) {
    return 1;
  } else {
    const error = new HttpError("commentId not found!", 404);
    throw error;
  }
}

// DELETE /post/{id}
async function deletePostById(id) {
  const postModel = mongoose.model("Post", PostSchema);

  const result = await postModel.deleteOne({ _id: id });
  return result;
}

// UPDATE /vote/{id}
async function votePost(postId, userId, value) {
  const postModel = mongoose.model("Post", PostSchema);

  if (userId === null) {
    return 0;
  } else {
    const inUpVote = await postModel.updateOne(
      { _id: postId },
      { $pull: { upVoteUsers: { userId: userId } } }
    );

    const inDownVote = await postModel.updateOne(
      { _id: postId },
      { $pull: { downVoteUsers: { userId: userId } } }
    );

    if (value == 1 && inUpVote.modifiedCount === 0) {
      await postModel.updateOne(
        { _id: postId },
        { $push: { upVoteUsers: { userId: userId } } }
      );
    }

    if (value == -1 && inDownVote.modifiedCount === 0) {
      await postModel.updateOne(
        { _id: postId },
        { $push: { downVoteUsers: { userId: userId } } }
      );
    }

    const upVoteUsers = await postModel.find(
      { _id: postId },
      { upVoteUsers: 1, _id: 0 }
    );

    const downVoteUsers = await postModel.find(
      { _id: postId },
      { downVoteUsers: 1, _id: 0 }
    );

    return [upVoteUsers, downVoteUsers];
  }
}

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  votePost,
  addCommentByPostId,
  updateCommentByPostId,
  deleteCommentByPostId,
};

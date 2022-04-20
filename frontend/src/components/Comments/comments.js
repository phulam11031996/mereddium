import React, { useState, useEffect } from "react";
import { Comment, CommentReply } from "../index";

export const Comments = (props) => {
  const [comments, setComments] = useState(props.comments);
  const [postId, setPostId] = useState(props.postId);

  const addComment = (newComments) => {
    setComments(newComments);
  };

  const deleteComment = (commentId) => {
    let updatedComments = comments.filter((comment) => {
      return comment._id != commentId;
    });
    setComments(updatedComments);
  };

  return (
    <>
      <div style={{ padding: 14 }} className="App">
        {comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              comment={comment}
              userId={props.userId}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>

      {props.userId && <CommentReply postId={postId} addComment={addComment} />}
    </>
  );
};

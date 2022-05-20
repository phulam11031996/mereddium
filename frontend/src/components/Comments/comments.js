import React, { useState } from "react";
import { Comment, CommentReply } from "../index";

export const Comments = (props) => {
  // eslint-disable-next-line
  const [postId, setPostId] = useState(props.postId);
  const [comments, setComments] = useState(props.comments);

  const addComment = (newComments) => {
    setComments(newComments);
  };

  const deleteComment = (commentId) => {
    let updatedComments = comments.filter((comment) => {
      return comment._id !== commentId;
    });
    setComments(updatedComments);
  };

  const updateComment = (commentId, newMessage) => {
    let updatedComments = comments.map((comment) => {
      if (comment._id !== commentId) {
        return comment;
      } else {
        comment.message = newMessage;
        return comment;
      }
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
              updateComment={updateComment}
            />
          );
        })}
      </div>

      {props.userId && (
        <CommentReply postId={props.postId} addComment={addComment} />
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Comment, CommentReply } from '../index';

export const Comments = (props) => {
    const [comments, setComments] = useState(props.comments);
    const [postId, setPostId] = useState(props.postId);

    const addComment = (newComments) => {
        console.log(newComments);
    };

    return (
        <>
            <div style={{ padding: 14 }} className="App">
                {comments.map((comment) => {
                    return Comment(comment);
                })}
            </div>

            <CommentReply postId={postId} addComment={addComment} />
        </>
    );
};

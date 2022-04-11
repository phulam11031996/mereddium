import React, { useState, useEffect } from 'react';
import { Comment, CommentReply } from '../index';

export const Comments = (props) => {
    const [comments, setComments] = useState(props.comments);
    const [postId, setPostId] = useState(props.postId);
    const [userId, setUserId] = useState(props.userId);

    const addComment = (newComments) => {
        setComments(newComments);
    };

    return (
        <>
            <div style={{ padding: 14 }} className="App">
                {comments.map((comment) => {
                    return <Comment key={comment._id} comment={comment} />;
                })}
            </div>

            {userId !== 'null' && (
                <CommentReply postId={postId} addComment={addComment} />
            )}
        </>
    );
};

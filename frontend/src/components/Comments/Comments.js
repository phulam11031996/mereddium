import React, { useState, useEffect } from 'react';
import DisplayComment from '../../app/pages/Comments/commentPage';

export const Comments = (props) => {
    const [comment, setComments] = useState({
        comments: props.comments,
        imageLink:
            'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
    });

    const listPosts = comment.comments.map((comment, index) => {
        return DisplayComment(index, comment);
    });

    return (
        <div style={{ padding: 14 }} className="App">
            {comment.comments.length > 0 && <h2>Comments</h2>}
            {listPosts}
        </div>
    );
};

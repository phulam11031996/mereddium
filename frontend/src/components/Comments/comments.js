import React, { useState } from 'react';
import { Comment } from '../index';

export const Comments = (props) => {
    const [comments, setComments] = useState(props.comments);
    const listPosts = comments.map((comment, index) => {
        return Comment(index, comment);
    });

    return (
        <div style={{ padding: 14 }} className="App">
            {listPosts}
        </div>
    );
};

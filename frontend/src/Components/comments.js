import React, {useState, useEffect} from 'react';
import axios from 'axios';


export default function Comments(props) {

    function CommentList(props) {
        const listPosts = props.comments.map((comment, index) => {
            return (
                <ul key={index}>
                    <p>________________________________________________</p>
                    {/* <li>_id: {comment._id}</li>
                    <li>userId: {comment.userId}</li>
                    <li>postId: {comment.postId}</li> */}
                    <li>timeStamp: {comment.timeStamp}</li>
                    <li>message: {comment.message}</li>
                    <li>upVote: {comment.upVote}</li>
                </ul>
            )
        });
        return (
            <div>
                {listPosts}
            </div>
            )
    }

  return (
    <div className='container'>
        {props.comments.length !== 0 ? <CommentList comments={props.comments}/> : null}
    </div>
  )

}


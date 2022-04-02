import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { parseCookie, useDynamicHeightField } from '../../utils';
import axios from 'axios';
import { createComment } from '../../utils';
const INITIAL_HEIGHT = 46;

export const CommentReply = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentValue, setCommentValue] = useState('');

    const postId = props.postId;

    const [user, setUser] = useState({
        userName: '',
        userId: ''
    });

    var userTemp;

    if (document.cookie) {
        userTemp = parseCookie(document.cookie).userId;
    }

    if (userTemp === 'null') {
        user.userId = null;
    } else {
        user.userId = userTemp;
    }

    useEffect(() => {
        axios
            .get('http://localhost:3030/user/' + user.userId)
            .then((user) => {
                setUser({ ...user, userName: user.data.data.user.firstName });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user.userId]);

    const outerHeight = useRef(INITIAL_HEIGHT);
    const textRef = useRef(null);
    const containerRef = useRef(null);

    useDynamicHeightField(textRef, commentValue);

    const onExpand = () => {
        if (!isExpanded) {
            outerHeight.current = containerRef.current.scrollHeight;
            setIsExpanded(true);
        }
    };

    const onChange = (e) => {
        setCommentValue(e.target.value);
    };

    const onClose = () => {
        setCommentValue('');
        setIsExpanded(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const newComment = {
            userId: user.userId,
            postId: postId,
            message: commentValue,
            upVote: 1
        };
        console.log(newComment);

        createComment(newComment);

        setCommentValue('');
        setIsExpanded(false);
    };

    return (
        <div className="container">
            <form
                onSubmit={onSubmit}
                ref={containerRef}
                className={cn('comment-box', {
                    expanded: isExpanded,
                    collapsed: !isExpanded,
                    modified: commentValue.length > 0
                })}
                style={{
                    minHeight: isExpanded ? outerHeight.current : INITIAL_HEIGHT
                }}
            >
                <div className="header">
                    <div className="user">
                        <img
                            src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/df/df7789f313571604c0e4fb82154f7ee93d9989c6.jpg"
                            alt="User avatar"
                        />
                        <span>{user.userName}</span>
                    </div>
                </div>
                <label htmlFor="comment" className="replyLabel">
                    What are your thoughts?
                </label>
                <textarea
                    ref={textRef}
                    onClick={onExpand}
                    onFocus={onExpand}
                    onChange={onChange}
                    className="comment-field"
                    placeholder="I know you want to comment"
                    value={commentValue}
                    name="comment"
                    id="comment"
                />
                <div className="actions">
                    <button type="button" className="cancel" onClick={onClose}>
                        Leave
                    </button>
                    <button type="submit" disabled={commentValue.length < 1}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

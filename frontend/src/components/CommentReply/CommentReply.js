import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { parseCookie, useDynamicHeightField } from '../../utils';
import axios from 'axios';
import { makeCommentCall } from '../../utils';
import { Avatar } from '@material-ui/core';

const INITIAL_HEIGHT = 60;

export const CommentReply = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [userId, setUserId] = useState('null');
    const [firstName, setFirstName] = useState('');
    const [photo, setPhoto] = useState('');

    const postId = props.postId;
    const outerHeight = useRef(INITIAL_HEIGHT);
    const textRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (document.cookie) {
            let getUser = parseCookie(document.cookie).userId;
            if (getUser !== 'null') {
                setUserId(getUser);
                axios
                    .get('http://localhost:3030/user/' + getUser)
                    .then((user) => {
                        setFirstName(user.data.data.user.firstName);
                        setPhoto(user.data.data.user.photo);
                    });
            }
        } else {
            setUserId(null);
        }
    }, []);

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

    const onSubmit = async (e) => {
        e.preventDefault();

        const newComment = {
            userId: userId,
            postId: postId,
            message: commentValue,
            upVote: 1
        };

        const result = await makeCommentCall(newComment);
        if (result !== false) {
            console.log('Comment Created!');
            props.addComment(result.data.data.comments);
        }
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
                        {photo !== '' && (
                            <Avatar src={`http://localhost:3030/${photo}`} />
                        )}
                        <span style={{ marginLeft: 10 }}>{firstName}</span>
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

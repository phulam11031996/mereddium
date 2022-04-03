import { useEffect } from 'react';
import axios from 'axios';

export const useDynamicHeightField = (element, value) => {
    useEffect(() => {
        if (!element) return;

        element.current.style.height = 'auto';
        element.current.style.height = element.current.scrollHeight + 'px';
    }, [element, value]);
};

export const parseCookie = (str) =>
    str
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
            );
            return acc;
        }, {});

export const createComment = (newComment) => {
    makeCommentCall(newComment).then((response) => {
        if (response.status === 200) {
            // this.componentDidMount();
        } else {
            console.log('Failed to create comment');
        }
    });
};

export const makeCommentCall = async (newComment) => {
    try {
        const response = await axios.post(
            'http://localhost:3030/comment/',
            newComment
        );
        return response;
    } catch (error) {
        return false;
    }
};

export const deletePostById = (id) => {
    makePostDeleteCall(id).then((response) => {
        if (response.status === 200) {
            console.log('Sucessfully Deleted!');
            window.location = '/';
        }
    });
};

export const makePostDeleteCall = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3030/post/${id}`);
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const createPost = async (post) => {
    try {
        const response = await axios.post('http://localhost:3030/post', post);
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const handleSortByTime = async () => {
    try {
        const response = await axios.get(`http://localhost:3030/post/`);
        let result = response.data.data;
        let filtered = result.sort((p1, p2) => {
            if (p1.createdAt < p2.createdAt) {
                return 1;
            } else {
                return -1;
            }
        });

        return filtered;
    } catch (e) {
        console.log(e);
    }
};

export const handleSortByVote = async () => {
    try {
        const response = await axios.get(`http://localhost:3030/post/`);
        let result = response.data.data;
        let filtered = result.sort((p1, p2) => {
            let p1Vote = p1.upVoteUsers.length - p1.downVoteUsers.length;
            let p2Vote = p2.upVoteUsers.length - p2.downVoteUsers.length;
            if (p1Vote < p2Vote) {
                return 1;
            } else if (p1Vote === p2Vote) {
                return 0;
            } else {
                return -1;
            }
        });

        return filtered;
    } catch (e) {
        console.log(e);
    }
};

export const handleSortByTrending = async () => {
    try {
        const response = await axios.get(`http://localhost:3030/post/`);
        let result = response.data.data;
        let filtered = result.sort((p1, p2) => {
            if (p1.createdAt < p2.createdAt) {
                return 1;
            } else {
                return -1;
            }
        });

        return filtered;
    } catch (e) {
        console.log(e);
    }
};

export const handleSearch = async (searchKey) => {
    try {
        const response = await axios.get(`http://localhost:3030/post/`);
        let result = response.data.data;
        let filtered = result.filter((post) => {
            return post.title.toLowerCase().match(searchKey.toLowerCase());
        });

        return filtered;
    } catch (e) {
        console.log(e);
    }
};

export const makeSignUpCall = async (user) => {
    try {
        const response = await axios.post(
            'http://localhost:3030/auth/signup',
            user
        );
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
};

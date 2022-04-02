import React, { useEffect, useState } from 'react';
import PostPage from './PostPage';
import { SideNav } from '../../../components';
import { AppHeader } from '../../../components';
import Box from '@mui/material/Box';
import axios from 'axios';

export default function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log('hello');
        axios
            .get(`http://localhost:3030/post/`)
            .then((response) => {
                setPosts(response.data.data);
                console.log('Fetching again!');
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    async function handleSortByTime() {
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

            setPosts(filtered);
        } catch (e) {
            console.log(e);
        }
    }

    async function handleSortByVote() {
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

            setPosts(filtered);
        } catch (e) {
            console.log(e);
        }
    }

    async function handleSortByTrending() {
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

            setPosts(filtered);
        } catch (e) {
            console.log(e);
        }
    }

    async function handleSearch(searchKey) {
        try {
            const response = await axios.get(`http://localhost:3030/post/`);
            let result = response.data.data;
            let filtered = result.filter((post) => {
                return post.title.toLowerCase().match(searchKey.toLowerCase());
            });
            setPosts(filtered);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box>
            <div className="NavBar">
                <AppHeader searchByKey={handleSearch} />
            </div>
            <div className="SideBar">
                <SideNav
                    sortByTime={handleSortByTime}
                    sortByVote={handleSortByVote}
                    sortByTrend={handleSortByTrending}
                />
            </div>
            <Box
                sx={{ flexGrow: 1 }}
                style={{
                    marginLeft: 100,
                    marginTop: 100,
                    marginRight: 50,
                    marginBottom: 30
                }}
            >
                <ul>
                    {posts &&
                        posts.map((currentPost, index) => {
                            return (
                                <PostPage
                                    key={currentPost._id}
                                    property={currentPost}
                                />
                            );
                        })}
                </ul>
            </Box>
        </Box>
    );
}

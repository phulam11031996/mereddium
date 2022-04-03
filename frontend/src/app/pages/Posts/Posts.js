import React, { useEffect, useState } from 'react';
import { Post, SideNav, AppHeader } from '../../../components/';
import Box from '@mui/material/Box';
import axios from 'axios';

import {
    handleSearch,
    handleSortByTime,
    handleSortByVote,
    handleSortByTrending
} from '../../../utils';

export const Posts = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
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

    async function filterFunc(key) {
        let result = [];
        if (key === 'Popular') {
            result = await handleSortByVote();
            setPosts(result);
        } else if (key === 'Recent') {
            result = await handleSortByTime();
            setPosts(result);
        } else if (key === 'Trending') {
            result = await handleSortByTrending();
            setPosts(result);
        } else {
            result = await handleSearch(key);
            setPosts(result);
        }
    }

    return (
        <Box>
            <div className="NavBar">
                <AppHeader searchByKey={filterFunc} />
            </div>
            <div className="SideBar">
                <SideNav sortBy={filterFunc} />
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
                                <Post
                                    key={currentPost._id}
                                    property={currentPost}
                                />
                            );
                        })}
                </ul>
            </Box>
        </Box>
    );
};

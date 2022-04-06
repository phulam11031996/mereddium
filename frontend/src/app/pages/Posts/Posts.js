import React, { useEffect, useState } from 'react';
import { Post, SideNav, AppHeader } from '../../../components/';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import {
    handleSearch,
    handleSortByTime,
    handleSortByVote,
    handleSortByTrending
} from '../../../utils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
}));

export const Posts = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        filterFunc('Popular');
    }, [posts.length]);

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

    const addPost = (newPost) => {
        setPosts([...posts, newPost]);
    };

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} xs={12}>
                <Box className="NavBar">
                    <AppHeader searchByKey={filterFunc} />
                </Box>
            </Grid>

            <Grid item lg={1} xs={1}>
                <Box className="SideBar">
                    <SideNav sortBy={filterFunc} addPost={addPost} />
                </Box>
            </Grid>

            <Grid item lg={8} xs={11}>
                <Box lg={8} xs={12} marginTop="50px">
                    <Item>
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
                    </Item>
                </Box>
            </Grid>
            <Grid item lg={3} xs={12} display={{ xs: 'none', lg: 'block' }}>
                <Box marginTop="50px">
                    <Item>Hello</Item>
                </Box>
            </Grid>
        </Grid>
    );
};

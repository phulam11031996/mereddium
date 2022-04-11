import React, { useEffect, useState } from 'react';
import { Post, SideNav, AppHeader } from '../../../components/';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { HashLoader } from 'react-spinners';
import { css } from '@emotion/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { createTheme } from '@mui/material/styles';

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

const override = css`
    display: block;
    margin: auto;
    margin-top: 200px;
    border-color: blue;
`;

const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontSize: '1rem'
                }
            }
        }
    }
});

export const Posts = (props) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        filterFunc('Recent');
    }, []);

    async function filterFunc(key) {
        let result = [];
        setLoading(true);
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
        setLoading(false);
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

            <Grid item lg={1} md={1} xs={1}>
                <Box className="SideBar">
                    <SideNav sortBy={filterFunc} addPost={addPost} />
                </Box>
            </Grid>

            <Grid item lg={8} md={9} xs={11}>
                <HashLoader loading={loading} css={override} size={50} />
                <Box lg={8} md={9} xs={12} marginTop="50px">
                    <Item>
                        <ul>
                            {posts &&
                                posts.map((currentPost) => {
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
            <Grid
                item
                lg={3}
                md={2}
                xs={12}
                display={{ md: 'block', lg: 'block' }}
            >
                <Box marginTop="50px" theme={theme}>
                    <Item>
                        Search By Tags
                        <Stack
                            direction={{ lg: 'row', md: 'column', xs: 'none' }}
                            spacing={{ lg: 1 }}
                            md={{
                                fontSize: '9px'
                            }}
                        >
                            <Button variant="outlined">Tech</Button>
                            <Button variant="outlined">Finance</Button>
                            <Button variant="outlined">Medicine</Button>
                            <Button variant="outlined">Music</Button>
                        </Stack>
                    </Item>
                </Box>
            </Grid>
        </Grid>
    );
};

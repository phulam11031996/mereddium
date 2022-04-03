import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import ListItemIcon from '@mui/material/ListItemIcon';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';

import { createPost } from '../../utils';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const CreatePost = (props) => {
    const [open, setOpen] = React.useState(false);

    const [post, setPost] = React.useState({
        userId: props.userId,
        title: '',
        message: '',
        imageURL: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleOnChange = (event) => {
        if (event.target.id === 'title') {
            setPost({
                userId: post.userId,
                title: event.target.value,
                message: post.message,
                imageURL: post.imageURL
            });
        } else if (event.target.id === 'message') {
            setPost({
                userId: post.userId,
                title: post.title,
                message: event.target.value,
                imageURL: post.imageURL
            });
        } else if (event.target.id === 'imageURL') {
            setPost({
                userId: post.userId,
                title: post.title,
                message: post.message,
                imageURL: event.target.value
            });
        }
    };

    const handleOnSubmit = (event) => {
        createPost(post).then((result) => {
            if (result.status === 201) {
                console.log(result.data.result);
                window.location = '/';
            }
        });

        handleClose();
        event.preventDefault();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ListItem onClick={handleClickOpen} button key="Key">
                <ListItemIcon style={{ marginLeft: '20px' }}>
                    <PostAddOutlinedIcon color="secondary" />
                </ListItemIcon>
            </ListItem>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar
                        style={{ width: '100%', backgroundColor: 'black' }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            style={{ color: 'white' }}
                            variant="h6"
                        >
                            Create a Post
                        </Typography>
                        <Button
                            autoFocus
                            color="inherit"
                            onClick={handleOnSubmit}
                            style={{
                                border: '1px solid white',
                                color: 'white'
                            }}
                        >
                            Submit
                        </Button>
                    </Toolbar>
                </AppBar>

                <List>
                    <ListItem>
                        <TextField
                            fullWidth
                            multiline
                            label="Title"
                            variant="standard"
                            id="title"
                            value={post.title}
                            onChange={handleOnChange}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            multiline
                            label="Message"
                            variant="standard"
                            id="message"
                            value={post.message}
                            onChange={handleOnChange}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            multiline
                            label="ImageURL"
                            variant="standard"
                            id="imageURL"
                            value={post.imageURL}
                            onChange={handleOnChange}
                        />
                    </ListItem>
                </List>
            </Dialog>
        </div>
    );
};

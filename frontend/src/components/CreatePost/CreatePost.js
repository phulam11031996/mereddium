import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

import ReactDOM from 'react-dom';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import MUIRichTextEditor from 'mui-rte';

const save = (data) => {
    console.log(data);
};

const myTheme = createTheme({});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const CreatePost = (props) => {
    const [open, setOpen] = useState(true);
    const [userId, setUserId] = useState(12);
    const [title, setTitle] = useState();
    const [message, setMessage] = useState();
    const [image, setImage] = useState('');
    let navigate = useNavigate();

    const handleOnChange = (event) => {
        if (event.target.id === 'title') {
            setTitle(event.target.value);
        } else if (event.target.id === 'message') {
            setMessage(event.target.value);
        } else if (event.target.id === 'imageURL') {
            setImage(event.target.value);
        }
    };

    const handleOnSubmit = (event) => {
        // event.preventDefault();
        // let post = {
        //     userId: userId,
        //     title: title,
        //     message: message,
        //     imageURL: image
        // };
        // makePostCall(post).then((result) => {
        //     if (result.status === 201) {
        //         props.addPost(result.data.post);
        //         handleClose();
        //     }
        // });
    };

    const handleClose = () => {
        setOpen(false);
        navigate('/', { replace: true });
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar style={{ width: '100%', backgroundColor: '#ffd6ba' }}>
                    <IconButton
                        edge="start"
                        style={{ backgroundColor: 'grey' }}
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon style={{ color: 'white' }} />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        style={{ color: 'black' }}
                        variant="h6"
                    >
                        Create a Post
                    </Typography>
                    <Button
                        autoFocus
                        onClick={handleOnSubmit}
                        style={{
                            border: '1px solid black',
                            color: 'black',
                            marginRight: '50px'
                        }}
                    >
                        Submit
                    </Button>
                </Toolbar>
            </AppBar>

            <Box style={{ padding: '40px' }}>
                <ThemeProvider theme={myTheme}>
                    <MUIRichTextEditor
                        label="Type something here..."
                        onSave={save}
                        inlineToolbar={true}
                    />
                </ThemeProvider>
            </Box>
        </Dialog>
    );
};

import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import ListItemIcon from "@mui/material/ListItemIcon";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const [post, setPost] = React.useState(
	{  
	   userId: '',
	   title: '',
	   message: '',
	   imageURL: ''
	}
 );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnChange = (event) => {
	if(event.target.id === "userId") {
		setPost({userId: event.target.value, title: post.title, message: post.message, imageURL: post.imageURL});
	}
	else if(event.target.id === "title") {
		setPost({userId: post.userId, title: event.target.value, message: post.message, imageURL: post.imageURL});
	}
	else if(event.target.id === "message") {
		setPost({userId: post.userId, title: post.title, message: event.target.value, imageURL: post.imageURL});	
	}
	else if(event.target.id === "imageURL") {
		setPost({userId: post.userId, title: post.title, message: post.message, imageURL: event.target.value});	
	}
  }

  async function makePostCall(post) {
    try {
      const response = await axios.post('http://localhost:3030/post', post);
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleOnSubmit = (event) => {
	makePostCall(post).then( result => {
		if(result.status === 201) {
		  console.log(result.data.result);
		  window.location = '/';
		}
	});
		
	handleClose();  
	event.preventDefault();
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ListItem onClick={handleClickOpen} button key="Key">
			<ListItemIcon>
			<PostAddOutlinedIcon color="secondary" />
			</ListItemIcon>
			<ListItemText primary="Create a Post" />
	  </ListItem>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar style={{backgroundColor: 'black'}}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create a Post
            </Typography>
            <Button autoFocus color="inherit" onClick={handleOnSubmit} style={{border: '1px solid white'}}>
              Submit
            </Button>
          </Toolbar>
        </AppBar>

        <List>
			<ListItem>
				<TextField 
				fullWidth 
				label="UserId" 
				variant="standard"
				id="userId"
        		value={post.userId}
				onChange = {handleOnChange} 
				/>
			</ListItem>
			<ListItem>
			<TextField 
				fullWidth
				multiline 
				label="Title" 
				variant="standard"
				id="title"
        		value={post.title}
				onChange = {handleOnChange} 
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
				onChange = {handleOnChange} 
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
				onChange = {handleOnChange} 
				/>
			</ListItem>
			
        </List>

		
      </Dialog>
    </div>
  );
}

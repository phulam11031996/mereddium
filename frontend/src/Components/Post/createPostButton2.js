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

import { editorConstructor } from '../editor';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const [open, setOpen] = React.useState(false);

  const [post, setPost] = React.useState(
	{
	   userId: props.userId,
	   title: '',
	   message: '',
	   imageURL: ''
	}
 );

	const editor = editorConstructor();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnSubmit = (event) => {
	editor.save().then((outputData) => {
		console.log('article data: ', outputData)
	  }).catch((error) => {
		console.log('Saving failed: ', error)
	  })
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
            
			<CloseIcon style = {{color: 'white'}} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} style={{color: 'white'}} variant="h6">
              Create a Post
            </Typography>
            <Button autoFocus color="inherit" onClick={handleOnSubmit} style={{border: '1px solid white', color: 'white'}}>
              Submit
            </Button>
          </Toolbar>
        </AppBar>

		<div className='Editor'>
			<div className="box">
				<div id="editorjs"></div>
			</div>
   	   </div>


      </Dialog>
    </div>
  );
}

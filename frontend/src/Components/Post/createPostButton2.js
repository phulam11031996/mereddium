import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ListItemIcon from "@mui/material/ListItemIcon";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import EditorJs from "../Editor.js/Editorjs";
import { Box } from '@material-ui/core';


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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnSubmit = (event) => {
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ListItem onClick={handleClickOpen} button key="Key">
	 	 	<ListItemIcon style={{ marginLeft: "20px"}}>
				<PostAddOutlinedIcon style ={{color: "black"}}  />
			</ListItemIcon>
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

		<Box style={{ margin: '20px'}}>
			<EditorJs />
		</Box>

		
		
      </Dialog>
    </div>
  );
}

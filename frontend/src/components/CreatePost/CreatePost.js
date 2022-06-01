import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import ListItemIcon from "@mui/material/ListItemIcon";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Tooltip from "@mui/material/Tooltip";

import { makePostCall } from "../../utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreatePost = (props) => {
  // eslint-disable-next-line
  const [userId, setUserId] = useState(props.userId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [image, setImage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnChange = (event) => {
    if (event.target.id === "title") {
      setTitle(event.target.value);
    } else if (event.target.id === "message") {
      setMessage(event.target.value);
    } else if (event.target.id === "imageURL") {
      setImage(event.target.value);
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    let post = {
      userId: props.userId,
      title: title,
      message: message,
      imageURL: image,
    };

    makePostCall(post).then((result) => {
      // console.log(result.data.newPost);
      if (result.status === 201) {
        props.addPost(result.data.newPost);
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Create Post" placement="right" arrow>
        <ListItem onClick={handleClickOpen} button key="Key">
          <ListItemIcon style={{ marginLeft: "20px" }}>
            <PostAddOutlinedIcon color="secondary" />
          </ListItemIcon>
        </ListItem>
      </Tooltip>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar style={{ width: "100%", backgroundColor: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              style={{ color: "white" }}
              variant="h6"
            >
              Create a Post
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleOnSubmit}
              style={{
                border: "1px solid white",
                color: "white",
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
              value={title}
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
              value={message}
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
              value={image}
              onChange={handleOnChange}
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
};

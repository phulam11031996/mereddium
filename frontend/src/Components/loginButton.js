import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';

import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import List from '@mui/material/List';
import TextField from '@mui/material/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);

  const [user, setUser] = React.useState(
    {
       email: '',
       password: '',
    }
   );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (event) => {
    if(event.target.id === "email") {
      setUser({email: event.target.value, password: user.password});
    }
    else if(event.target.id === "password") {
      setUser({email: user.email, password: event.target.value});
    }
  }

  async function logInCall(user) {
    try {
      const response = await axios.post('http://localhost:3030/auth/login', user);
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleOnSubmit = (event) => {
    logInCall(user).then( jwt => {

    if(jwt.status === 200) {
      document.cookie = `jwt=${jwt.data.token}`;
      document.cookie = `userId=${jwt.data.data.user._id}`;
      window.location = '/';
		}
	});

	handleClose();
	event.preventDefault();
  }

  return (
    <div>
      <ListItem onClick={handleClickOpen} button key="login">
        <ListItemIcon>
          <LoginOutlinedIcon color="secondary" style={{ color: "blue" }} />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </ListItem>
      <Dialog
        open={open}
        fullWidth
        maxWidth = {'xs'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Sign In"}</DialogTitle>

        <List>
          <ListItem>
            <TextField
            fullWidth
            label="email"
            variant="standard"
            id="email"
            value={user.email}
            onChange = {handleOnChange}
            />
          </ListItem>
          <ListItem>
          <TextField
            fullWidth
            multiline
            label="password"
            variant="standard"
            id="password"
                value={user.password}
            onChange = {handleOnChange}
            />
          </ListItem>
        </List>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOnSubmit}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

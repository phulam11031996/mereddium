import * as React from 'react';
import axios from 'axios';

import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export default function AlertDialogSlide() {

  const handLogOut = async(event) => {
      await axios.get('http://localhost:3030/auth/logout');
      document.cookie = 'jwt=null';
      document.cookie = 'userId=null';
      window.location = '/';
	}

  return (
    <div>
      <ListItem onClick={handLogOut} button key="login">
        <ListItemIcon>
          <LoginOutlinedIcon color="secondary" style={{ color: "red" }} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>

    </div>
  );
}

import * as React from "react";
import axios from "axios";

import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import { deleteAllCookies } from "../../../utils";

export const LogOut = () => {
  const handLogOut = async (event) => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`);
    deleteAllCookies();
    window.location = "/";
  };

  return (
    <div>
      <Tooltip title="Logout" placement="right" arrow>
        <ListItem onClick={handLogOut} button key="login">
          <ListItemIcon style={{ marginLeft: "20px" }}>
            <LoginOutlinedIcon color="secondary" style={{ color: "red" }} />
          </ListItemIcon>
        </ListItem>
      </Tooltip>
    </div>
  );
};

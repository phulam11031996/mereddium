import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import { Logo } from "../../images/Logo";
import { CreatePost } from "../index";
import { Dashboard } from "../Dashboard";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { LogOut } from "../../app/pages";

import { parseCookie } from "../../utils";

const DrawerHeader = styled("div")(() => ({
  position: "relative",
  top: 15,
  left: 30,
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({}));

export const SideNav = (props) => {
  const [userId, setUserId] = useState("null");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (document.cookie) {
      let getUser = parseCookie(document.cookie).userId;
      if (getUser !== "null") {
        setUserId(getUser);
        setLogin(true);
      }
    } else {
      setUserId(null);
      setLogin(false);
    }
  }, [login]);

  return (
    <Box>
      <Drawer variant="permanent">
        <DrawerHeader style={{ width: "50px" }}>
          <Logo />
        </DrawerHeader>
        <List style={{ marginTop: "15px" }}>
          <Tooltip title="Popular" placement="right" arrow>
            <ListItem
              button
              key="Popular"
              onClick={(e) => {
                props.sortBy("Popular");
              }}
              className="tooltip"
            >
              <ListItemIcon style={{ marginLeft: "25px" }}>
                <WhatshotIcon color="primary" />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Recent" placement="right" arrow>
            <ListItem
              button
              key="Recent"
              onClick={(e) => {
                props.sortBy("Recent");
              }}
            >
              <ListItemIcon style={{ marginLeft: "25px" }}>
                <AccessTimeOutlinedIcon color="secondary" />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Trending" placement="right" arrow>
            <ListItem
              button
              key="Trending"
              onClick={(e) => {
                props.sortBy("Trending");
              }}
            >
              <ListItemIcon style={{ marginLeft: "25px" }}>
                <TrendingUpOutlinedIcon color="secondary" />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          {login && (
            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
          )}

          {login && (
            <Tooltip title="Saved Posts" placement="right" arrow>
              <ListItem
                button
                key="Saved"
                onClick={() => props.savedPosts(userId)}
              >
                <ListItemIcon style={{ marginLeft: "25px" }}>
                  <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          )}

          {login && <CreatePost userId={userId} addPost={props.addPost} />}

          <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />

          {!login && (
            <Tooltip title="Login" placement="right" arrow>
              <ListItem
                button
                key="login"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                <ListItemIcon style={{ marginLeft: "25px" }}>
                  <LoginOutlinedIcon
                    color="secondary"
                    style={{ color: "blue" }}
                  />
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          )}

          {login && <Dashboard userId={userId} addPost={props.addPost} />}

          {login && <LogOut />}
        </List>
      </Drawer>
    </Box>
  );
};

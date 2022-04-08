import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import { Logo } from "../../images/Logo";
import { CreatePost, CreatePostEditor } from "../index";
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
    const [userId, setUserId] = useState('null');
    const [login, setLogin] = useState(false);

    useEffect(() => {
        if (document.cookie) {
            let getUser = parseCookie(document.cookie).userId;
            if (getUser !== 'null') {
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
                <DrawerHeader>
                    <Logo />
                </DrawerHeader>
                <List style={{ marginTop: 10 }}>
                    <ListItem
                        button
                        key="Popular"
                        onClick={(e) => {
                            props.sortBy('Popular');
                        }}
                    >
                        <ListItemIcon style={{ marginLeft: '20px' }}>
                            <WhatshotIcon color="primary" />
                        </ListItemIcon>
                    </ListItem>

                    <ListItem
                        button
                        key="Recent"
                        onClick={(e) => {
                            props.sortBy('Recent');
                        }}
                    >
                        <ListItemIcon style={{ marginLeft: '20px' }}>
                            <AccessTimeOutlinedIcon color="secondary" />
                        </ListItemIcon>
                    </ListItem>

                    <ListItem
                        button
                        key="Trending"
                        onClick={(e) => {
                            props.sortBy('Trending');
                        }}
                    >
                        <ListItemIcon style={{ marginLeft: '20px' }}>
                            <TrendingUpOutlinedIcon color="secondary" />
                        </ListItemIcon>
                    </ListItem>

                    {login && (
                        <Divider
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                        />
                    )}

                    {login && (
                        <ListItem button key="Saved" onClick={() => props.savedPosts(userId)}>
                            <ListItemIcon style={{ marginLeft: '20px' }}>
                                <Badge color="primary" variant="dot">
                                    <BookmarkBorderOutlinedIcon
                                        style={{ color: 'orange' }}
                                    />
                                </Badge>
                            </ListItemIcon>
                        </ListItem>
                    )}

                    {login && (
                        <CreatePost userId={userId} addPost={props.addPost} />
                    )}

                    {login && (
                        <CreatePostEditor
                            userId={userId}
                            handleSubmit={props.updateList}
                        />
                    )}

                    <Divider
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                    />

                    {!login && (
                        <ListItem
                            button
                            key="login"
                            onClick={() => {
                                window.location.href = '/login';
                            }}
                        >
                            <ListItemIcon style={{ marginLeft: '20px' }}>
                                <LoginOutlinedIcon
                                    color="secondary"
                                    style={{ color: 'blue' }}
                                />
                            </ListItemIcon>
                        </ListItem>
                    )}
                    {login && <Dashboard userId={userId} addPost={props.addPost} />}
                    {login && <LogOut />}
                </List>
            </Drawer>
        </Box>
    );
};

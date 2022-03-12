import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import CreateButton from '../Post/createPostButton';
import CreateButton2 from '../Post/createPostButton2';

import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutButton from '../Login/logoutButton';

import { ReactComponent as Logo } from '../../Images/logo.svg';
import Typography from '@mui/material/Typography';

import { parseCookie } from '../../Helper/cookieParser';

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(12)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`
  }
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 0,
    background: "black",
    padding: "0 1px",
    fontSize: "10px"
  }
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default function MiniDrawer(props) {
  const [open, setOpen] = React.useState(false);
  const [state] = React.useState({
    userId: "",
    login: false
  })

  var user;
  if(document.cookie) {
    user = parseCookie(document.cookie).userId;
    console.log(user);
  }

  if(user === "null") {
    state.login = false;
  } else {
    state.userId = user;
    state.login = true;
  }

  const handleDrawer = () => {
		if(open === true) {
			setOpen(false);
		} else {
			setOpen(true);
		}
  };


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader style = {{backgroundColor: "white", minHeight: "70px"}}>
        
        <Logo
              onClick={() => { window.location.href = "/"; }}
              style = {{ position: "absolute", top: "5", left: "10", height: "50px", width: "50px", marginLeft: "15px", marginTop: "5px"}}
        />
       
        </DrawerHeader>
        <List >
          <ListItem button key="Popular" onClick={() => { window.location.href = "/popular"; }}>
            <ListItemIcon style={{ marginLeft: "20px"}}>
              <WhatshotIcon color="primary" />
            </ListItemIcon>
          </ListItem>

          <ListItem button key="Recent" onClick={() => { window.location.href = "/recent"; }}>
            <ListItemIcon style={{ marginLeft: "20px"}}>
              <AccessTimeOutlinedIcon color="secondary" />
            </ListItemIcon>
          </ListItem>

          <ListItem button key="Trending" onClick={() => { window.location.href = "/trending"; }}>
            <ListItemIcon style={{ marginLeft: "20px"}}>
              <TrendingUpOutlinedIcon color="secondary" />
            </ListItemIcon>
          </ListItem>

          {state.login && <Divider  style={{ marginTop: "10px", marginBottom: "10px"}}/> }
          
          {state.login &&
          <ListItem button key="Saved">
            <ListItemIcon style={{ marginLeft: "20px"}}>
              <Badge color="primary" variant="dot">
                <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />
              </Badge>
            </ListItemIcon>
          </ListItem>
          }

          {state.login &&
          <CreateButton userId={user} handleSubmit={props.updateList} />
          }

          {state.login &&
          <CreateButton2 userId = {state.userId} handleSubmit={props.updateList} />
          }

          <Divider  style={{ marginTop: "10px", marginBottom: "10px"}}/>

          {!state.login && 
            <ListItem  button key="login" onClick={() => { window.location.href = "/login"; }}>
              <ListItemIcon style={{ marginLeft: "20px"}}>
                <LoginOutlinedIcon color="secondary" style={{ color: "blue" }}  />
              </ListItemIcon>
          </ListItem>
          }
          {state.login && <LogoutButton /> }

        </List>
      </Drawer>
    </Box>
  );
}

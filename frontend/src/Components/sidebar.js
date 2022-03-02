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

import CreateButton from './createPostButton';
import LoginButton from './loginButton';
import LogoutButton from './logoutButton';

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`
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
    userId: props.userId,
    login: true
  })
  
  if(state.userId === undefined) {
    state.userId = -1;
  }

  if(state.userId.length >= 5) {
    state.login = false;
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
        <DrawerHeader style = {{backgroundColor: "black", minHeight: "70px"}}>
          <IconButton onClick={handleDrawer} style = {{color: "white"}}>
				{
					open === false?
					<ChevronRightIcon />
					:
					<ChevronLeftIcon />
				}

          </IconButton>
        </DrawerHeader>
        <List>
          <ListItem button key="Popular" onClick={() => { window.location.href = "/popular"; }}>
            <ListItemIcon>
              <WhatshotIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Popular" />
          </ListItem>

          <ListItem button key="Recent" onClick={() => { window.location.href = "/recent"; }}>
            <ListItemIcon>
              <AccessTimeOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Recent" />
          </ListItem>

          <ListItem button key="Trending" onClick={() => { window.location.href = "/trending"; }}>
            <ListItemIcon>
              <TrendingUpOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItem>

          <Divider />

          {!state.login &&
          <ListItem button key="Saved">
            <ListItemIcon>
              <StyledBadge badgeContent={12} style={{ color: "white" }}>
                <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />
              </StyledBadge>
            </ListItemIcon>
            <ListItemText primary="Saved" />
          </ListItem>
          }

          {!state.login &&
          <CreateButton userId = {state.userId} handleSubmit={props.updateList} />
          }

          <Divider />

          {state.login && <LoginButton /> }
          {!state.login && <LogoutButton /> }

        </List>
      </Drawer>
    </Box>
  );
}

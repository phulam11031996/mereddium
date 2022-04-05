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
import ListItemIcon from "@mui/material/ListItemIcon";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import UploadImage from "./UploadImage";

import { updateUserImage } from "../../utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dashboard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [file, setFile] = useState({
    image: null,
  });

  const getImage = (image) => {
    setFile({ image });
  };

  const handleOnSubmitImage = async (event) => {
    event.preventDefault();
    const image = new FormData();
    file.image && image.append("image", file.image);

    await updateUserImage(image, props.userId).then((response) => {
      if (response) {
        console.log(response.data.message);
        // setIsOpen(false);
        window.location = "/";
      } else {
        console.log("Can't upload image.");
      }
    });
  };

  return (
    <div>
      <ListItem
        onClick={() => {
          setIsOpen(true);
        }}
        button
        key="Key"
      >
        <ListItemIcon style={{ marginLeft: "20px" }}>
          <ManageAccountsIcon color="secondary" style={{ color: "0077b6" }} />
        </ListItemIcon>
      </ListItem>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar style={{ width: "100%", backgroundColor: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setIsOpen(false);
              }}
              aria-label="close"
            >
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              style={{ color: "white" }}
              variant="h6"
            >
              User Dashboard
            </Typography>
            <Button
              disabled={file.image ? false : true}
              autoFocus
              color="inherit"
              onClick={handleOnSubmitImage}
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
            <UploadImage getImage={getImage} />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
};

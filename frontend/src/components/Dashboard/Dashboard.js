import React, { useState } from "react";
import axios from "axios";

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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip from "@mui/material/Tooltip";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Dashboard = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [path, setPath] = useState(null);
  const [delToken, setDelToken] = useState(null);

  const handleOnSubmit = async () => {
    await axios
      .patch(`${process.env.REACT_APP_BACKEND_URL}/user/${props.userId}`, {
        photo: path,
      })
      .then((res) => {
        setIsOpen(false);
        window.location = "/";
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteImage = async () => {
    await axios
      .post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/delete_by_token`,
        { token: delToken }
      )
      .then(() => {
        setPath(null);
        setFileName(null);
        setDelToken(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOpenWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
        sources: [
          "local",
          "url",
          "image_search",
          "facebook",
          "dropbox",
          "instagram",
        ],
        googleApiKey: process.env.REACT_APP_GOOGLEAPI,
        showAdvancedOptions: true,
        cropping: true,
        multiple: false,
        max_files: 5000000,
        client_allowed_formats: ["png", "bmp", "jpeg", "gif"],
      },
      (err, info) => {
        if (info.event === "success") {
          setDelToken(info.info.delete_token);
          setPath(info.info.path);
          setFileName(info.info.original_filename);
        }
      }
    );
  };

  return (
    <div>
      <Tooltip title="Dashboard" placement="right" arrow>
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
      </Tooltip>
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
              disabled={fileName ? false : true}
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
            <Button
              onClick={handleOpenWidget}
              size="small"
              style={{
                border: "2px solid black",
                color: "black",
              }}
            >
              <UploadFileIcon />
              {fileName ? `${fileName}` : `Upload Image`}
            </Button>
            {fileName && (
              <Button
                onClick={handleDeleteImage}
                size="small"
                style={{
                  color: "black",
                }}
              >
                <ClearIcon />
              </Button>
            )}
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
};

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .max(40)
        .required("First Name is required"),
      lastName: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .max(40)
        .required("Last Name is required"),
    }),
    onSubmit: async (values) => {
      await axios
        .patch(`${process.env.REACT_APP_BACKEND_URL}/user/${props.userId}`, {
          firstName: values.firstName,
          lastName: values.lastName,
        })
        .then((res) => {
          window.location = "/";
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

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
              Submit Image
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              aria-label="basic tabs example"
            >
              <Tab label="Account Settings" {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={Boolean(
                      formik.touched.firstName && formik.errors.firstName
                    )}
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                    value={formik.values.firstName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={Boolean(
                      formik.touched.lastName && formik.errors.lastName
                    )}
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                    value={formik.values.lastName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
              </Grid>
              <Button
                disabled={!(formik.isValid && formik.dirty)}
                onClick={formik.handleSubmit}
                name="submit"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
            <List>
              <ListItem style={{ display: "flex", justifyContent: "flex-end" }}>
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
          </TabPanel>
        </Box>
      </Dialog>
    </div>
  );
};

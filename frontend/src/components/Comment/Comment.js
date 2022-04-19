import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Typography from "@mui/material/Typography";
import { Avatar } from "@material-ui/core";

export const Comment = (props) => {
  const [comment, setComment] = useState(props.comment);
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3030/user/" + comment.userId)
      .then((user) => {
        setFirstName(user.data.data.user.firstName);
        setPhoto(user.data.data.user.photo);
        setUserId(user.data.data.user._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteComment = async () => {
    await axios.delete().then().catch();
  }

  return (
    <Card key={comment._id} style={{ padding: "5px 5px", marginTop: "5px" }}>
      <CardHeader
        avatar={
          photo !== "" && (
            <Avatar
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/c_crop,g_custom/${photo}`}
            />
          )
        }
        action={
          props.userId == userId && (
            <IconButton onClick={handleDeleteComment}>
              <DeleteOutlineIcon style={{ color: "#ee6c4d" }} />
            </IconButton>
          )
        }
        title={firstName}
        subheader={comment.lastModifiedAt.slice(0, 10)}
      />
      <CardContent>
        <Typography paragraph>{comment.message}</Typography>
      </CardContent>
    </Card>
  );
};

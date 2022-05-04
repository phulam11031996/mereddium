import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Typography from "@mui/material/Typography";
import { Avatar } from "@material-ui/core";

import { getCookie } from "../../utils";

export const Comment = (props) => {
  // have to comment out to pass ci-and-cd test
  // const [comment, setComment] = useState(props.comment);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3030/user/" + props.comment.userId)
      .then((user) => {
        setUserId(user.data.data.user._id);
        setFirstName(user.data.data.user.firstName);
        setPhoto(user.data.data.user.photo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDeleteComment = async () => {
    const postId = props.comment.postId;
    await axios
      .delete(`http://localhost:3030/comment/${postId}`, {
        data: { postId: postId },
        headers: { Authorization: `Basic ${getCookie("jwt")}` },
      })
      .then((res) => {
        props.deleteComment(res.data.commentId);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Card
      key={props.comment._id}
      style={{ padding: "5px 5px", marginTop: "5px" }}
    >
      <CardHeader
        avatar={
          photo !== "" && (
            <Avatar
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/c_crop,g_custom/${photo}`}
            />
          )
        }
        action={
          props.userId === userId && (
            <IconButton onClick={handleDeleteComment}>
              <DeleteOutlineIcon style={{ color: "#ee6c4d" }} />
            </IconButton>
          )
        }
        title={firstName}
        subheader={props.comment.lastModifiedAt.slice(0, 10)}
      />
      <CardContent>
        <Typography paragraph>{props.comment.message}</Typography>
      </CardContent>
    </Card>
  );
};

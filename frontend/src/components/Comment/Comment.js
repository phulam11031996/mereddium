import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import { Avatar } from "@material-ui/core";

import Input from "@mui/material/Input";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { getCookie } from "../../utils";
import { Box } from "@mui/system";

export const Comment = (props) => {
  const initStateComment = props.comment.message.replace(/\r?\n|\r/g, "");

  // eslint-disable-next-line
  const [comment, setComment] = useState(props.comment);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");
  const [editCommentMode, setEditCommentMode] = useState(false);
  const [commentValue, setCommentValue] = useState(initStateComment);

  useEffect(() => {
    axios
      .get("http://localhost:3030/user/" + comment.userId)
      .then((user) => {
        setUserId(user.data.data.user._id);
        setFirstName(user.data.data.user.firstName);
        setPhoto(user.data.data.user.photo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteComment = async () => {
    await axios
      .delete(`http://localhost:3030/comment/${comment._id}`, {
        data: { postId: comment.postId },
        headers: { Authorization: `Basic ${getCookie("jwt")}` },
      })
      .then((res) => {
        props.deleteComment(res.data.commentId);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditSubmit = async () => {
    setEditCommentMode(false);
    await axios
      .patch(
        `http://localhost:3030/comment/${comment._id}`,
        {
          postId: comment.postId,
          message: commentValue,
        },
        { headers: { Authorization: `Basic ${getCookie("jwt")}` } }
      )
      .then(() => {
        props.updateComment(comment.id, commentValue);
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  const handleEditComment = async () => {
    setEditCommentMode(true);
  };

  const handleCloseEdit = async () => {
    setEditCommentMode(false);
    setCommentValue(initStateComment);
  };

  const onChange = (e) => {
    setCommentValue(e.target.value);
  };

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
          <>
            {!editCommentMode && props.userId === userId && (
              <Box>
                <IconButton onClick={handleEditComment}>
                  <EditIcon style={{ color: "#0077b6" }} fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDeleteComment}>
                  <DeleteOutlineIcon
                    style={{ color: "#ee6c4d" }}
                    fontSize="small"
                  />
                </IconButton>
              </Box>
            )}
            {editCommentMode && (
              <Box>
                <IconButton
                  onClick={handleEditSubmit}
                  disabled={
                    initStateComment === commentValue || commentValue === ""
                      ? true
                      : false
                  }
                >
                  <CheckIcon style={{ color: "#0077b6" }} fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCloseEdit}>
                  <ClearIcon style={{ color: "#ee6c4d" }} fontSize="small" />
                </IconButton>
              </Box>
            )}
          </>
        }
        title={firstName}
        subheader={comment.lastModifiedAt.slice(0, 10)}
      />
      <CardContent>
        {editCommentMode ? (
          <Card style={{ padding: "10px 10px", marginTop: "7px" }}>
            <Input
              maxRows={4}
              minRows={3}
              fullWidth
              multiline
              disableUnderline
              value={commentValue}
              onChange={onChange}
              // autoFocus
              // autoFocus commented out because can't find a way to have to cursor move to the front
            />
          </Card>
        ) : (
          <Typography paragraph>{comment.message}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

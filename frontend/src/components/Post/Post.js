import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { Comments } from "..";
import { parseCookie, deletePostById } from "../../utils";
import { getCookie } from "../../utils";
import axios from "axios";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const Post = (props) => {
  // eslint-disable-next-line
  const [login, setLogin] = useState(false);
  // eslint-disable-next-line
  const [postId, setPostId] = useState(props.property._id);
  // eslint-disable-next-line
  const [title, setTitle] = useState(props.property.title);
  // eslint-disable-next-line
  const [message, setMessage] = useState(props.property.message);
  // eslint-disable-next-line
  const [comments, setComments] = useState(props.property.comments);
  // eslint-disable-next-line
  const [turnOnComments, setTurnOffComments] = useState(
    props.property.turnOnComments
  );
  // eslint-disable-next-line
  const [subTitle, setSubtitle] = useState(
    props.property.message.slice(0, 350)
  );

  const [expanded, setExpanded] = useState(false);
  const [userId, setUserId] = useState("null");
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");
  const [userMatch, setUserMatch] = useState(false);
  const [postUserId, setPostUsedId] = useState(props.property.userId);
  const [upVoteUsers, setUpvoteUsers] = useState(props.property.upVoteUsers);
  const [downVoteUsers, setDownVoteUsers] = useState(
    props.property.downVoteUsers
  );
  const [userSavedPosts, setUserSavedPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3030/user/" + props.property.userId)
      .then((user) => {
        setPostUsedId(user.userId);
        setFirstName(user.data.data.user.firstName);
        setPhoto(user.data.data.user.photo);
      })
      .catch((error) => {
        console.log(error);
      });

    if (document.cookie) {
      let getUser = parseCookie(document.cookie).userId;
      if (getUser !== "null") {
        setUserId(getUser);
        setLogin(true);
        if (getUser === postUserId) {
          setUserMatch(true);
        }
      } else {
        setUserId(null);
      }

      axios
        .get("http://localhost:3030/user/" + getUser)
        .then((user) => {
          setUserSavedPosts(user.data.data.user.savedPosts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // votes posts
  function votePost(userId, postId, value) {
    if (userId !== null) {
      makeVoteCall(userId, postId, value).then((response) => {
        if (response.status === 200) {
          console.log("Sucessfully Voted!");
          setUpvoteUsers(response.data.data.upVoteUsers[0].upVoteUsers);
          setDownVoteUsers(response.data.data.downVoteUsers[0].downVoteUsers);
        }
      });
    } else {
      console.log("Must login first!");
    }
  }

  async function makeVoteCall(userId, postId, value) {
    try {
      const response = await axios.post(
        `http://localhost:3030/post/vote/${postId}`,
        { userId: userId, value: value },
        { headers: { Authorization: `Basic ${getCookie("jwt")}` } }
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // save post
  async function savePost(userId, postId) {
    if (userId === "null") {
      console.log("Must login first!");
    } else {
      const response = await makeSaveCall(userId, postId);
      if (response.status === 200 && response.data === { postId }) {
        console.log("Post Already Saved!");
      } else if (response.status === 200) {
        console.log("Successfully Unsaved Post!");
      } else if (response.status === 201) {
        console.log("Successfully Saved Post!");
      }

      const user = await axios.get("http://localhost:3030/user/" + userId);
      setUserSavedPosts(user.data.data.user.savedPosts);
    }
  }

  async function makeSaveCall(userId, postId) {
    try {
      const userSaved = userSavedPosts.some((saved) => saved.postId === postId);
      if (userSaved) {
        const response = await axios.delete(
          `http://localhost:3030/user/saved/${userId}`,
          { data: { postId: postId } }
        );
        return response;
      } else {
        const response = await axios.post(
          `http://localhost:3030/user/saved/${userId}`,
          { postId: postId }
        );
        return response;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <Card sx={{ maxWidth: 800 }} style={{ marginTop: 50 }}>
      <CardHeader
        avatar={
          photo !== "" && (
            <Avatar
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/c_crop,g_custom/${photo}`}
            />
          )
        }
        action={
          userMatch && (
            <IconButton onClick={() => deletePostById(props.property._id)}>
              <DeleteOutlineIcon style={{ color: "#ee6c4d" }} />
            </IconButton>
          )
        }
        title={firstName}
        subheader={props.property.createdAt.slice(0, 10)}
      />

      {props.property.imageURL !== "" ? (
        <CardMedia
          height="500"
          image={props.property.imageURL}
          alt="Paella dish"
        />
      ) : null}

      <CardContent>
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ color: "black", fontSize: 24 }}
        >
          {title}
        </Typography>
        <Typography paragraph>{subTitle + " ..."}</Typography>
      </CardContent>

      <CardActions disableSpacing style={{ marginLeft: 20 }}>
        <IconButton onClick={() => votePost(userId, postId, 1)}>
          {upVoteUsers.find((ele) => ele.userId === userId) !== undefined ? (
            <ThumbUpAltIcon style={{ color: "#0077b6" }} fontSize="small" />
          ) : (
            <ThumbUpOutlinedIcon
              style={{ color: "#0077b6" }}
              fontSize="small"
            />
          )}
        </IconButton>

        <Typography style={{ padding: 10, fontSize: 14 }}>
          {upVoteUsers.length - downVoteUsers.length}
        </Typography>

        <IconButton onClick={() => votePost(userId, postId, -1)}>
          {downVoteUsers.find((ele) => ele.userId === userId) !== undefined ? (
            <ThumbDownAltIcon style={{ color: "#ee6c4d" }} fontSize="small" />
          ) : (
            <ThumbDownOutlinedIcon
              style={{ color: "#ee6c4d" }}
              fontSize="small"
            />
          )}
        </IconButton>

        <IconButton
          style={{ marginLeft: 5 }}
          onClick={() => savePost(userId, postId)}
        >
          {userSavedPosts.some((saved) => saved.postId === postId) ===
            false && <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />}
          {userSavedPosts.some((saved) => saved.postId === postId) === true && (
            <BookmarkIcon style={{ color: "orange" }} />
          )}
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{message}</Typography>
        </CardContent>

        {turnOnComments && (
          <Comments comments={comments} postId={postId} userId={userId} />
        )}
      </Collapse>
    </Card>
  );
};

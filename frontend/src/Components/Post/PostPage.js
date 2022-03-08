import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import CommentReply from '../Comments/CommentReply';
import { parseCookie } from '../../Helper/cookieParser';
import axios from 'axios';

import { deletePostById } from "./deletePost"
import Comments from '../Comments/comment';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Posts(props) {
  const [expanded, setExpanded] = useState(false);
  
  const [user, setUser] = useState({
    userId: "",
    postOwnerName: "",
  });
  
  const [state, setState] = useState({
    postUserId: props.property.userId,  
    postId: props.property._id,
    title: props.property.title,
    message: props.property.message,
    login: false,
    userMatch: false,
    turnOnComments: props.property.turnOnComments,
    subTitle: props.property.message.slice(0,350),
    comments: props.property.comments,
    upVoteUsers: props.property.upVoteUsers,
    downVoteUsers: props.property.downVoteUsers,
  });

  var userCheck;
  if(document.cookie) {
    userCheck = parseCookie(document.cookie).userId;
  }

  if(userCheck === "null") {
    user.userId = null;
    state.login = false;
  } else {
    user.userId = userCheck;
    state.login = true;
    
    if(state.postUserId === userCheck) {
      state.userMatch = true;
    }
  }

  useEffect(() => {
		axios.get("http://localhost:3030/user/" + props.property.userId)
		.then(user => {
			 setUser({ 
        userId: user.userId, 
        postOwnerName: user.data.data.user.firstName
       })
		}).catch((error) => {
			console.log(error);
		})
	},[props.property.userId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    // votes posts
  function votePost(userId, postId, value){
    if(userId !== null) {
      makeVoteCall(userId, postId, value).then( response => {
        if (response.status === 200) {
        console.log("Sucessfully Voted!");
          setState({
            ...state,
            upVoteUsers : response.data.data.upVoteUsers[0].upVoteUsers,
            downVoteUsers : response.data.data.downVoteUsers[0].downVoteUsers,
          })
        }
      })
    } else {
        console.log("Must login first!")
      }
  }

  async function makeVoteCall(userId, postId, value) {
    try {
      const response = await axios.post(`http://localhost:3030/post/vote/${postId}`,
          { userId: userId, value: value }
        );
        return response;
    }
    catch (error){
      console.log(error);
      return false;
    }
  }

  return (
    <Card sx={{ maxWidth: 800 }}   style = {{marginTop: 50}}>

      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {user.postOwnerName.slice(0,2)}
          </Avatar>
        }
        action = {
        <IconButton onClick={() => deletePostById(props.property._id)} >
            {state.userMatch &&
            <DeleteOutlineIcon style={{color: '#ee6c4d'}}  />
            }
        </IconButton>
        }
        title={user.postOwnerName}
        subheader={props.property.createdAt.slice(0,10)}
      />

      {props.property.imageURL !== '' ?
        <CardMedia
        component="img"
        height="500"
        image= {props.property.imageURL}
        alt="Paella dish"
      /> : null}

      <CardContent>
        <Typography variant="body1" color="text.secondary" style={{color: 'black', fontSize: 24}}>
          {state.title}
        </Typography>
        <Typography paragraph>
          {state.subTitle + " ..."}
        </Typography>
      </CardContent>

      <CardActions disableSpacing style={{marginLeft: 20}}>
        
      <IconButton onClick={() => votePost(user.userId, state.postId, 1)}>
          {
            state.upVoteUsers.find(ele => ele.userId === user.userId) !== undefined ?
            <ThumbUpAltIcon style = {{color: '#0077b6'}} fontSize ="small"/> :
            <ThumbUpOutlinedIcon style = {{color: '#0077b6'}} fontSize ="small"/>
          }
        </IconButton>

        <Typography style= {{padding: 10, fontSize: 14}}>
          {state.upVoteUsers.length -  state.downVoteUsers.length}
        </Typography>

        <IconButton onClick={() => votePost(user.userId, state.postId, -1)}>
          {
            state.downVoteUsers.find(ele => ele.userId === user.userId) !== undefined ?
            <ThumbDownAltIcon style = {{color: '#ee6c4d'}} fontSize ="small"/> :
            <ThumbDownOutlinedIcon style = {{color: '#ee6c4d'}} fontSize ="small"/>
          }
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
          <Typography paragraph>
            {state.message}
          </Typography>
        </CardContent>
      
      {state.turnOnComments &&
      <Comments comments={state.comments} />
      }

      {state.login &&
      <CommentReply postId={props.property._id} />
      }
      </Collapse>

    </Card>
  );
}
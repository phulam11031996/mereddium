import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from 'axios';
import { postList } from "./Components/Post/post";
import Signin from "./Components/Login/SigninForm";
import Signup from "./Components/Login/SignupForm";
import PostSearch from './Components/Post/postSearch';

import './index.css';
function MyApp() {

  const [state, setState] = useState({
		posts: []
	})
	
	useEffect(() => {
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			setState({ posts: response.data.data })
		}).catch((error) => {
			console.log(error);
		})
	},[]);

  // // votes posts
  // function votePost(userId, postId, value){
  //   makeVoteCall(userId, postId, value).then( response => {
  //     if (response.status === 200) {
  //     console.log("Sucessfully Voted!");
  //       // setState({
  //       //   posts: state.posts.map(post => {
  //       //     if (post._id !== postId) {
  //       //       return post;
  //       //     } else {
  //       //       post.upVoteUsers = response.data.data.upVoteUsers;
  //       //       post.downVoteUsers = response.data.data.downVoteUsers;
  //       //       return post;
  //       //     }
  //       //   })
  //       // })
  //       window.location = '/';
  //     } else {
  //       console.log("Must login first!")
  //     }
  //   });
  // }

  // async function makeVoteCall(userId, postId, value) {
  //   try {
  //     const response = await axios.post(`http://localhost:3030/post/vote/${postId}`,
  //         { userId: userId, value: value }
  //       );
  //       return response;
  //   }
  //   catch (error){
  //     console.log(error);
  //     return false;
  //   }
  // }

  return (
        <Router>
          <Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
            <Routes>
              <Route exact path="/" element={postList("", state.posts)} />
              <Route exact path="/popular" element={postList("popular", state.posts)} />
              <Route exact path="/recent" element={postList("recent", state.posts)} />
              <Route exact path="/trending" element={postList("trending", state.posts)} />
              <Route exact path="/search" element={postList("", state.posts)} />
              <Route path="/search/:query" element={<PostSearch posts={state.posts} />} />
              <Route exact path="/login" element={<Signin />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Router>
  );
}

ReactDOM.render(<MyApp />, document.getElementById('root'));

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from 'axios';
import { postList } from "./Components/Post/post";

import './index.css';

import SideBar from './Components/Sidebar/sidebar';
import AppBar from './Components/AppBar/Appbar';
import PostSearch from './Components/Post/postSearch';

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

  return (
    <div>
      <div className="NavBar">
        <AppBar/>
      </div>

      <div className="SideBar">
        <SideBar/>
      </div>

      <Router>
        <Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
          <Routes>
            <Route exact path="/" element={postList("", state.posts)} />
            <Route exact path="/popular" element={postList("popular", state.posts)} />
            <Route exact path="/recent" element={postList("recent", state.posts)} />
            <Route exact path="/trending" element={postList("trending", state.posts)} />
            <Route exact path="/search" element={postList("", state.posts)} />
            <Route path="/search/:query" element={<PostSearch posts={state.posts} />} />
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

ReactDOM.render(<MyApp />, document.getElementById('root'));

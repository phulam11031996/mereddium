import React, { useEffect, useState } from "react";
import { Post, SideNav, AppHeader } from "../../../components/";
import Box from "@mui/material/Box";

import {
  handleSearch,
  handleSortByTime,
  handleSortByVote,
  handleSortByTrending,
  handleSavedPosts,
} from "../../../utils";

export const Posts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    filterFunc("Popular");
  }, []);

  async function filterFunc(key) {
    let result = [];
    if (key === "Popular") {
      result = await handleSortByVote();
      setPosts(result);
    } else if (key === "Recent") {
      result = await handleSortByTime();
      setPosts(result);
    } else if (key === "Trending") {
      result = await handleSortByTrending();
      setPosts(result);
    } else {
      result = await handleSearch(key);
      setPosts(result);
    }
  }

  async function savedPosts(userId) {
    let result = await handleSavedPosts(userId);
    setPosts(result);
  }

  const addPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  return (
    <Box>
      <div className="NavBar">
        <AppHeader searchByKey={filterFunc} />
      </div>
      <div className="SideBar">
        <SideNav
          sortBy={filterFunc}
          savedPosts={savedPosts}
          addPost={addPost}
        />
      </div>
      <Box
        sx={{ flexGrow: 1 }}
        style={{
          marginLeft: 100,
          marginTop: 100,
          marginRight: 50,
          marginBottom: 30,
        }}
      >
        <ul>
          {posts &&
            posts.map((currentPost, index) => {
              return <Post key={currentPost._id} property={currentPost} />;
            })}
        </ul>
      </Box>
    </Box>
  );
};

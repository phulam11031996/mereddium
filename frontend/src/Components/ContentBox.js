import React, { Component } from 'react';
import Box from "@mui/material/Box";
import Post from "./Post";
import axios from 'axios';

export default class ContentBox extends Component {
	constructor(props) {
		super(props);
	
	
		this.state = {posts: []};
	  }
	
	  componentDidMount() {
		axios.get(`http://localhost:3030/post/`)
		  .then(response => {
			this.setState({ posts: response.data.data })
			console.log(response.data.data);
		  })
		  .catch((error) => {
			console.log(error);
		  })
	  }

	  postList() {
		const postList = this.state.posts.map((currentPost, index) => {
		  return (
				<Post 
				key={index}
				property = {{"like": currentPost.upVote, 
							"title": currentPost.title, 
							"message": currentPost.message,
							"img": currentPost.imageURL} } 

				/>
		  )
	  
		});
		return (
		  <ul>
			{postList}
		  </ul>
		)
	  }

	render() {
		return (
			<Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
				{this.postList()}
			</Box>
		);
	}
}

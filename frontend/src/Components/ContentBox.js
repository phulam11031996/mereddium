import React, { Component } from 'react';
import Box from "@mui/material/Box";
import axios from 'axios';

import Post from "./Post";

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
					deletePostById={this.deletePostById}
					property = {{
						"comments": currentPost.comments,
						"createAt": currentPost.createAt,
						"imageURL": currentPost.imageURL,
						"lastModifiedAt": currentPost.lastModifiedAt,
						"message": currentPost.message,
						"published": currentPost.published,
						"stringify": currentPost.stringify,
						"tags": currentPost.tags,
						"title": currentPost.title,
						"turnOnComments": currentPost.turnOnComments,
						"upVote": currentPost.upVote,
						"userId": currentPost.userId,
						"_id": currentPost._id
						}} 
				/>
			)
		});
		return (
			<ul>
			{postList}
			</ul>
		)
	}

	deletePostById = (_id) => {
		this.makeDeleteCall(_id).then( response => {
			if (response.status === 200) {
				console.log("Sucessfully Deleted!")
				let updatedPosts = this.state.posts.filter((post) => {
				  	return post._id !== _id
				});
				this.setState(updatedPosts);
				window.location = '/';
			}
		});
	}

	async makeDeleteCall(id) {
		try {
			const response = await axios.delete(`http://localhost:3030/post/${id}`);
			return response;
		}
		catch (error){
			console.log(error)
			return false;
		}
	}

	render() {
		return (
			<Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
				{this.postList()}

			</Box>
		);
	}
}

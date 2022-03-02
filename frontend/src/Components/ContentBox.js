import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from 'axios';

import Post from "./Post";

export default class ContentBox extends Component {
	constructor(props) {
		super(props);
		this.state = {posts: []};
	}


	// Similar to useEffect
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

	// displays all posts
	postList() {
		const postList = this.state.posts.map((currentPost, index) => {
			return (
				<Post
					key={index}
					createComment={this.createComment}
					deletePostById={this.deletePostById}
					upDownVote={this.upDownVote}
					property = {currentPost}
					currentUserId = {this.props.userId}
				/>
			)
		});
		return (
			<ul>
			{postList}
			</ul>
		)
	}

	popular_postList() {
		const postList = this.state.posts.sort((p1, p2) => {
			const v1 = p1['upVote'];
			const v2 = p2['upVote'];
			return v2 - v1;
		})
		.map((currentPost, index) => {
			return (
				<Post 
					key={index}
					createComment={this.createComment}
					deletePostById={this.deletePostById}
					upDownVote={this.upDownVote}
					property = {currentPost} 
					currentUserId = {this.props.userId}
				/>
			)
		});
		return (
			<ul>
			{postList}
			</ul>
		)
	}

	recent_postList() {
		const postList = this.state.posts.sort((p1, p2) => {
			const t1 = new Date(p1['createdAt']);
			const t2 = new Date(p2['createdAt']);
			return t2 - t1;
		})
		.map((currentPost, index) => {
			return (
				<Post 
					key={index}
					createComment={this.createComment}
					deletePostById={this.deletePostById}
					upDownVote={this.upDownVote}
					property = {currentPost}
					currentUserId = {this.props.userId}
				/>
			)
		});
		return (
			<ul>
			{postList}
			</ul>
		)
	}

	trending_postList() {
		const postList = this.state.posts.filter((post) => {
			const time = new Date(post['createdAt']);
			var threshold = new Date();
			threshold.setDate(threshold.getDate() - 30);
			return time > threshold;
		})
		.sort((p1, p2) => {
			const v1 = p1['upVote'];
			const v2 = p2['upVote'];
			return v2 - v1;
		})
		.map((currentPost, index) => {
			return (
				<Post 
					key={index}
					createComment={this.createComment}
					deletePostById={this.deletePostById}
					upDownVote={this.upDownVote}
					property = {currentPost}
					currentUserId = {this.props.userId}
				/>
			)
		});
		return (
			<ul>
			{postList}
			</ul>
		)
	}

	// deletes posts
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

	async makeDeleteCall(_id) {
		try {
			const response = await axios.delete(`http://localhost:3030/post/${_id}`);
			return response;
		}
		catch (error){
			console.log(error);
			return false;
		}
	}

	// votes posts
	upDownVote = (_id, numUpVote, vote) => {
		this.makeVoteCall(_id, numUpVote, vote).then (response => {
			if (response.status === 200){
				console.log("Sucessfully Upvoted!")

				this.setState({
					posts: this.state.posts.map( post => {
						if (post._id === _id){
							post.upVote += vote;
							return post;
						} else return post;
					})
				});
			}
		});
	}

	async makeVoteCall(_id, numUpVote, vote) {
		try {
			const response = await axios.patch(`http://localhost:3030/post/${_id}`, {upVote: numUpVote + vote});
			return response;
		}
		catch (error){
			console.log(error)
			return false;
		}
	}

	// comments posts
	createComment = (newComment) => {
		console.log(newComment);
		this.makeCommentCall(newComment).then (response => {
			if (response.status === 200){
				this.componentDidMount();
			} else {
				console.log("Failed to create comment");
			}
		});
	}

	async makeCommentCall(newComment) {
		try {
			const response = await axios.post("http://localhost:3030/comment/", newComment);
			return response;
		}
		catch (error){
			return false;
		}
	}



	render() {
		return (
			<Router>
				<Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
					<Routes>
						<Route exact path="/" element={this.postList()} />
						<Route exact path="/popular" element={this.popular_postList()} />
						<Route exact path="/recent" element={this.recent_postList()} />
						<Route exact path="/trending" element={this.trending_postList()} />
					</Routes>
				</Box>
			</Router>
		);
	}
}

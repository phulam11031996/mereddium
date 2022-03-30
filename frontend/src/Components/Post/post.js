import React, { useEffect, useState } from 'react';
import PostPage from "./PostPage";
import SideBar from '../Sidebar/sidebar';
import AppBar from '../AppBar/Appbar';
import Box from "@mui/material/Box";
import axios from 'axios';
import { debounce } from "lodash";

/*----------------------------------------------------------------

	
	} else if(sort_filter === "trending") {
		// filter posts created in the last 30 days and sort by most votes
		postList = postList.filter((post) => {
			const time = new Date(post['createdAt']);
			var threshold = new Date();
			threshold.setDate(threshold.getDate() - 30);
			return time > threshold;
		}).sort((p1, p2) => {
			return compare_votes(p1, p2);
		});
	}

*/
// compile post list
export default function PostList () {
	const [state, setState] = useState({posts: []});

	useEffect(() => {
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			setState({posts: response.data.data})
			console.log("Fetching again!");
		}).catch((error) => {
			console.log(error);
		})
	},[]);

	function handleSortByTime() {
		setState({posts: []})
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			let result = response.data.data;
			let filtered = result.sort((p1, p2) => {
				if (p1.createdAt < p2.createdAt) {
					return 1;
				} else {
					  return -1;
				}
			});
			console.log(filtered)
			setState({posts: filtered});
		}).catch((error) => {
			console.log(error);
		})
	}

	function handleSortByVote() {
		setState({posts: []})
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			let result = response.data.data;
			let filtered = result.sort((p1, p2) => {
				let p1Vote = p1.upVoteUsers.length - p1.downVoteUsers.length;
				let p2Vote = p2.upVoteUsers.length - p2.downVoteUsers.length;
				if (p1Vote < p2Vote){
					return 1;
				} else if (p1Vote === p2Vote) {
					return 0;
				} else {
					return -1;
				}
			});
			setState({posts: filtered});
		}).catch((error) => {
			console.log(error);
		})
	}


	function handleSortByTranding() {
		setState({posts: []})
		axios.get(`http://localhost:3030/post/`)
		.then(response => {
			let result = response.data.data;
			let filtered = result.sort((p1, p2) => {
				let p1Vote = p1.upVoteUsers.length - p1.downVoteUsers.length;
				let p2Vote = p2.upVoteUsers.length - p2.downVoteUsers.length;
				if (p1Vote < p2Vote){
					return 1;
				} else if (p1Vote === p2Vote) {
					return 0;
				} else {
					return -1;
				}
			});
			setState({posts: filtered});
		}).catch((error) => {
			console.log(error);
		})
	}

	function handleSearch(searchKey) {
		setState({posts: []})
		axios.get(`http://localhost:3030/post/`)
			 .then(response => {
				let result = response.data.data;
				let filtered = result.filter(post => {
					return post.title.toLowerCase().match(searchKey.toLowerCase());
				})
		setState({posts: filtered});
			}).catch((error) => {
				console.log(error);
			})	
	}
	
	
	const postList = state.posts.map((currentPost, index) => {
		return (
			<PostPage
				key={index}
				property = {currentPost}
			/>
		)
	});


	return (
		<Box>
			<div className="NavBar">
				<AppBar searchByKey = {handleSearch}/>
			</div>
			<div className="SideBar">
				<SideBar sortByTime = {handleSortByTime} sortByVote = {handleSortByVote} sortByTrend = {handleSortByTranding}/>
			</div>
			<Box sx={{ flexGrow: 1 }} style={{marginLeft: "10px", marginTop: "100px", marginRight: "10px", marginBottom: "30px"}}>
				<ul>
					{postList}
				</ul>
			</Box>
		</Box>
	)
}


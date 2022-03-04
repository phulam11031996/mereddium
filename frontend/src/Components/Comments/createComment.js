import axios from 'axios';
// comments posts
export function createComment (newComment){
	makeCommentCall(newComment).then (response => {
		if (response.status === 200){
			// this.componentDidMount();
		} else {
			console.log("Failed to create comment");
		}
	});
}

async function makeCommentCall(newComment) {
	try {
		const response = await axios.post("http://localhost:3030/comment/", newComment);
		return response;
	}
	catch (error){
		return false;
	}
}
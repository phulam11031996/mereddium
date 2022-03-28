import axios from 'axios';

// deletes posts
export function deletePostById (_id) {
	makePostDeleteCall(_id).then( response => {
		if (response.status === 200) {
			console.log("Sucessfully Deleted!")
			// let updatedPosts = this.state.posts.filter((post) => {
			// 	  return post._id !== _id
			// });
			// this.setState(updatedPosts);
			window.location = '/';
		}
	});
}

async function makePostDeleteCall(_id) {
	try {
		const response = await axios.delete(`http://localhost:3030/post/${_id}`);
		return response;
	}
	catch (error){
		console.log(error);
		return false;
	}
}

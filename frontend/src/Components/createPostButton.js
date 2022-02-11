import React from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ListItemIcon from "@mui/material/ListItemIcon";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

class PostForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			userId: "",
			title: "",
			message: "",
		};

		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	
	handleClickOpen = () => {
	  this.setState({open: true});
	};
  
	handleClose = () => {
		this.setState({open: false});
	};

	handleChange(event) {
		
		if(event.target.id === "userId") {
			this.setState({userId : event.target.value})
		} 
		else if (event.target.id === "title") {
			this.setState({title : event.target.value})
		}
		else if (event.target.id === "message") {
			this.setState({message : event.target.value})
		}

		console.log(event.target.id);
	}

	
	handleSubmit(event) {
		alert('Created: ' + this.state.userId + "\n" + this.state.title + "\n" + this.state.message);
		event.preventDefault();
	}
	
	render() {
		return (
			<div>
			<form>
			
			
			<ListItem onClick={this.handleClickOpen} button key="Key">
				<ListItemIcon>
				<PostAddOutlinedIcon color="secondary" />
				</ListItemIcon>
				<ListItemText primary="Create a Post" />
          	</ListItem>

			<Dialog open={this.state.open} onClose={this.handleClose}>
				<DialogTitle>Create a post</DialogTitle>
				<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="userId"
					label="UserID"
					value = {this.state.userId}
					onChange = {this.handleChange}
					fullWidth
					variant="standard"
				/>
				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="Title"
					value={this.state.title}
					onChange = {this.handleChange} 
					fullWidth
					variant="standard"
				/>
				<TextField
					margin="dense"
					id="message"
					label="Content"
					value={this.state.message}
					onChange = {this.handleChange} 
					multiline
					fullWidth
					variant="standard"
				/>
				</DialogContent>
				<DialogActions>
				<Button onClick={this.handleClose}>Cancel</Button>
				<Button type="submit" onClick={this.handleSubmit}>Post</Button>
				</DialogActions>
			</Dialog>
			</form>
			</div>
		);
	}
}

 
// Exporting the component
export default PostForm;


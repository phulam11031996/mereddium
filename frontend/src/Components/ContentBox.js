import React from 'react';
import Box from "@mui/material/Box";
import Post from "./Post";

export default function ContentBox() {
	return (
		<Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
			<Post />
			<Post />
			<Post />
		</Box>
	);
}

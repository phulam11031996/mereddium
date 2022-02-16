import React from 'react';
import Box from "@mui/material/Box";
import Post from "./Post";

export default function ContentBox() {
	return (
		<Box sx={{ flexGrow: 1 }} style={{marginLeft: 100, marginTop: 30, marginRight: 50, marginBottom: 30}}>
			
			<Post property = {{"like": 32, 
								"title": "15 Things Java Developer Should Learn in 2022", 
								"message": "Hello guys, another year is approaching and it’s a good time to look back and retrospect on what you have achieved last year and what you could have done better. The Spring Boot framework also has a new release Spring Boot 2. If I get sometime after all these goals this year then I will spend some time learning Spring Boot 2.",
								"img": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190813181110/7-Tips-and-Tricks-to-Learn-Programming-Faster.png"} } 

			/>
			<Post property = {{"like": 13, 
								"title": "British English, American English, and Wordle", 
								"message": "On Wednesday, I was bored at work and decided to have a go at everyone’s new favourite word game. I do pretty well at Wordle- I do all the clever strategies, maximising common letters with words like “arise” or “slate,” trying unusual configurations, et cetera. Being as I was at my finance job a couple blocks from Times Square, I was also thinking about the recent news that the game had been sold to the New York Times. It occurred to me to wonder: whose spelling conventions would this British game, owned by an American paper, use?",
								"img": "https://miro.medium.com/max/1400/1*llNhR1GlxjnUGNwcqHsljg.jpeg"} } 
								
			/>
			<Post property = {{"like": 12, 
								"title": "15 Things Java Developer Should Learn in 2022", 
								"message": "Hello guys, another year is approaching and it’s a good time to look back and retrospect on what you have achieved last year and what you could have done better.",
								"img": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190813181110/7-Tips-and-Tricks-to-Learn-Programming-Faster.png"} } 

			/>
			<Post property = {{"like": 142, 
								"title": "British English, American English, and Wordle", 
								"message": "On Wednesday, I was bored at work and decided to have a go at everyone’s new favourite word game. I do pretty well at Wordle- I do all the clever strategies, maximising common letters with words like “arise” or “slate,” trying unusual configurations, et cetera. Being as I was at my finance job a couple blocks from Times Square, I was also thinking about the recent news that the game had been sold to the New York Times. It occurred to me to wonder: whose spelling conventions would this British game, owned by an American paper, use?",
								"img": "https://miro.medium.com/max/1400/1*llNhR1GlxjnUGNwcqHsljg.jpeg"} } 
								
			/>
		</Box>
	);
}

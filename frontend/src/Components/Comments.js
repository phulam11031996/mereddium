import React from 'react';

import { Avatar, Grid, Paper } from "@material-ui/core";

export default function Comments(props) {


  function CommentList(props) {
    const listPosts = props.comments.map((comment, index) => {
        return (
          <Paper style={{ padding: "40px 20px" }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src={imgLink} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
                <p style={{ textAlign: "left" }}>
                  {comment.message}
                </p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  posted at {comment.timeStamp}
                </p>
              </Grid>
            </Grid>
          </Paper>
        )
    });
    return (
        <div>
            {listPosts}
        </div>
        )
}

  const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";
  
  return (
    <div style={{ padding: 14 }} className="App">
      <h1>Comments</h1>
        {props.comments.length !== 0 ? <CommentList comments={props.comments} /> : null}

    </div>
  );
  
}
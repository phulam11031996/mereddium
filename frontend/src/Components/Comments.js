import React from 'react';
import { Avatar, Grid, Paper } from "@material-ui/core";

export default function Comments(props) {


  function CommentList(props) {
    const listPosts = props.comments.map((comment, index) => {
        var timeStamp = comment.timeStamp;
        var year = timeStamp.slice(0,4);
        var month = timeStamp.slice(5,7);
        var day = timeStamp.slice(8,10);
        var hour = timeStamp.slice(11,13);
        var minute = timeStamp.slice(14,16);

        switch(month) {
          case "01":
            month = "Jan";
            break;
          case "02":
            month = "Feb";
            break;
          case "03":
            month = "Mar";
            break;
          case "04":
            month = "Apr";
            break;
          case "05":
            month = "May";
            break;
          case "06":
            month = "Jun";
            break;
          case "07":
            month = "Jul";
            break;
          case "08":
            month = "Aug";
            break;
          case "09":
            month = "Sep";
            break;
          case "10":
            month = "Oct";
            break;
          case "11":
            month = "Nov";
            break;
          case "12":
            month = "Dec";
            break;
          default:
            month = "";
            break;
        }

        return (
          <Paper style={{ padding: "40px 20px" }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src={imgLink} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <div>
                <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
                </div>
                <p style= {{ textAlign: "left", marginTop: "0px", color: "grey", fontSize: "10px"}}>{year}, {month} - {day} at {hour}:{minute}</p>
                <p style={{ textAlign: "left" }}>
                  {comment.message}
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
import React, { useEffect, useState } from 'react';
import { Avatar, Grid, Paper } from '@material-ui/core';
import { monthToString } from '../../utils';
import axios from 'axios';

export const Comment = (index, comment) => {
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        axios
            .get('http://localhost:3030/user/' + comment.userId)
            .then((user) => {
                setFirstName(user.data.data.user.firstName);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const imgLink =
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';

    let timeStamp = comment.timeStamp;

    let year = timeStamp.slice(0, 4);
    let month = timeStamp.slice(5, 7);
    let day = timeStamp.slice(8, 10);
    let hour = timeStamp.slice(11, 13);
    let minute = timeStamp.slice(14, 16);

    month = monthToString(month);

    return (
        <Paper key={index} style={{ padding: '40px 20px', marginTop: '10px' }}>
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                    <Avatar alt="Remy Sharp" src={imgLink} />
                </Grid>
                <Grid item xs zeroMinWidth>
                    <div>
                        <h4 style={{ margin: 0, textAlign: 'left' }}>
                            {firstName}
                        </h4>
                    </div>
                    <p
                        style={{
                            textAlign: 'left',
                            marginTop: '0px',
                            color: 'grey',
                            fontSize: '10px'
                        }}
                    >
                        {year}, {month} - {day} at {hour}:{minute}
                    </p>
                    <p style={{ textAlign: 'left' }}>{comment.message}</p>
                </Grid>
            </Grid>
        </Paper>
    );
};

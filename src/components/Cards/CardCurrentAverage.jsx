import React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';



const CardCurrentAverage = ({ lastTrace }) => {
    const {loadAverageLast1Min} = lastTrace;
    return (
            <CardContent>
            <Typography variant="overline" justify-content="center">
            {loadAverageLast1Min? loadAverageLast1Min :  <Skeleton  variant="rect" width="10rem" height="5rem" />}
            </Typography >
                <Typography color="textSecondary" gutterBottom>
                    Current CPU Load Average</Typography>
                <Typography component="p">
        Value refreshed every x seconds</Typography>
            </CardContent>
    )
}

export default CardCurrentAverage;
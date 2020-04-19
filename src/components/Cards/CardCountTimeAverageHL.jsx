import React from 'react';
import { CardContent, Typography } from '@material-ui/core';



const CardCountTimeAverageHL = ({ lastTrace }) => {


    const {loadAverageLast1Min} = lastTrace;


    return (
            <CardContent>
            <Typography variant="overline">
            3
            <Typography>(including 1 currently in progress)</Typography>
            </Typography >
                <Typography color="textSecondary" gutterBottom>
                    Count of High Load Event last X min</Typography>
                <Typography component="p">
        More details about these events are available in related section : link</Typography>
            </CardContent>
    )
}

export default CardCountTimeAverageHL;
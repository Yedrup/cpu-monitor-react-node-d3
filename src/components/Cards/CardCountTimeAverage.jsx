import React from 'react';
import { CardContent, Typography } from '@material-ui/core';


const CardCountTimeAverageRecov = ({ lastTrace }) => {

    const {loadAverageLast1Min} = lastTrace;

    return (
            <CardContent>
            <Typography variant="overline">
            2
            </Typography >
                <Typography color="textSecondary" gutterBottom>
                    Count of the event related</Typography>
                <Typography component="p">
        More details about these events are available in related section : link</Typography>
            </CardContent>
    )
}

export default CardCountTimeAverageRecov;
import React from 'react';
import { CardContent, Typography } from '@material-ui/core';



const CardLastXMin = ({ lastTrace }) => {

    const {loadAverageLast1Min} = lastTrace;

    return (
            <CardContent>
            <Typography variant="overline" >
            5.5
            </Typography >
                <Typography color="textSecondary" gutterBottom>
                    Average Last X Minutes</Typography>
                <Typography component="p">
        Value refreshed every x seconds</Typography>
            </CardContent>
    )
}

export default CardLastXMin;
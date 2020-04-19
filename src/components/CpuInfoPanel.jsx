import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, Typography, Collapse, IconButton } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
    callApi
} from "../utilities/utilities";

function CpuInfo() {
    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 20,
        },
        expand: {
            transform: 'rotate(0deg)',
            margin: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }));

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    const [cpuInfo, setCpuInfo] = useState({
        cpusCount: null,
        cpusList: []
    });
    useEffect(() => {
        callApi("api/cpu/info").then(info => setCpuInfo(info));
    }, [])
    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>CPUS INFO </Typography>
                <Typography color="primary">
                    CPU Number: {cpuInfo.cpusCount}
                </Typography>
                <CardActions disableSpacing>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMore />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <ul className="cpu-info">
                        {cpuInfo.cpusList.map((cpu, index) => {
                            return (
                                <li key={index}>
                                    <span>cpu n°{index} </span>
                                    <span>model:{cpu.model} </span>
                                    <span>speed:{cpu.speed}</span>
                                </li>
                            )
                        })}
                    </ul>
                </Collapse>
            </CardContent>
        </Card>


    )
}

export default CpuInfo

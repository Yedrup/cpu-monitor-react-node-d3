// one card to rule them all
import React, { Fragment } from 'react';
import { Card, CardHeader, CardContent, withStyles, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    TrendingDown,
    TrendingFlat,
    TrendingUp,
    Timelapse,
    History,
    AvTimer
} from '@material-ui/icons';
import clsx from "clsx";


const IconCust = ({ iconName }) => {


    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: ".5rem",
            fontSize: "1.8rem",
        },
        colorIconDefault: {
            color: theme.palette.icons.default
        },
        colorIconHighLoad: {
            color: theme.palette.icons.highLoad
        },
        colorIconRecovery: {
            color: theme.palette.icons.recovery
        },
        colorIconFlat: {
            color: theme.palette.icons.flat
        }
    }));
    const classes = useStyles();

    switch (iconName) {
        case 'TrendingDown': return <TrendingDown className={clsx(classes.icon, classes.colorIconRecovery)} />
        case 'TrendingFlat': return <TrendingFlat className={clsx(classes.icon, classes.colorIconFlat)} />
        case 'TrendingUp': return <TrendingUp className={clsx(classes.icon, classes.colorIconHighLoad)} />
        case 'Timelapse': return <Timelapse className={clsx(classes.icon, classes.colorIconFlat)} />
        case 'History': return <History className={clsx(classes.icon, classes.colorIconDefault)} />
        case 'AvTimer': return <AvTimer className={clsx(classes.icon, classes.colorIconDefault)} />
        default: return null
    }
}



const CardCustom = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('sm')]: {
            maxWidth: "100%"
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: 220,
            margin: 15
        },
        [theme.breakpoints.up('lg')]: {
            maxWidth: 250,
            margin: 0
        },
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    }
}))(Card);


const CardHeaderCustom = withStyles((theme) => ({
    root: {
        textAlign: "left",
        height: "4.5rem",
        paddingBottom: 0,
        alignItems: "baseline",
        justifyContent: "baseline",
        [theme.breakpoints.down('sm')]: {
            height: "5.5rem"
        },
    },
    title: {
        color: theme.palette.primary.contrastText,
        fontSize: "1rem",
        alignItems: "flex-start",
        display: "flex"
    },
    subheader: {
        color: theme.palette.grey
    }
}))(CardHeader);

const CardContentCustom = withStyles((theme) => ({
    root: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 0
    }
}))(CardContent);

const CardPresentation = ({ isConditionalSentence = true, traces, mainValue, text = {} }) => {

    const useStyles = makeStyles((theme) => ({
        mainValue: {
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: theme.palette.primary.main
        },
        content: {
            fontSize: ".9em",
        }
    }))

    const classes = useStyles();

    const { title, subheader, conditionSentence, moreDetails, iconName } = text;

    return (
        <CardCustom elevation={2}>
            <CardHeaderCustom
                title={(
                    <Fragment>
                        <IconCust iconName={iconName} />
                        {title}
                    </Fragment>
                )}
                subheader={subheader}
            />
            <CardContentCustom>
                <Typography className={classes.mainValue}>
                    {mainValue}
                </Typography >
                <Typography color="primary" className={classes.content}>{isConditionalSentence ? conditionSentence : ""}</Typography>
                <Typography className={classes.content} component="p">
                    {moreDetails}</Typography>
            </CardContentCustom>
        </CardCustom>
    )
}

export default CardPresentation;
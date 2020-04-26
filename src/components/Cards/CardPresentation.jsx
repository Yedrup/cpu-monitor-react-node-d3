// one card to rule them all
import React from 'react';
import { Card, CardHeader, CardContent, withStyles, Typography, Divider } from '@material-ui/core';
// import { useTheme } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';




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
        }
    },
    title: {
        color: theme.palette.primary.contrastText,
        fontSize: "1rem"
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
            fontSize: "2rem",
            fontWeight: "bold",
            color: theme.palette.primary.main
        },
        content: {
            fontSize: ".9em",
        }
    }))

    const classes = useStyles();

    const { title, subheader, conditionSentence, moreDetails } = text;

    return (
        <CardCustom elevation={2}>
            <CardHeaderCustom
                title={title}
                subheader={subheader}
            />
            {/* <Divider variant="fullWidth" /> */}

            <CardContentCustom>
                <Typography className={classes.mainValue} /*color="success"*/>
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
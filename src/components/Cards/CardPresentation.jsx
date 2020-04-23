// one card to rule them all
import React from 'react';
import { Card, CardHeader, CardContent, withStyles, Typography, Divider } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';



const CardCustom = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: 15,
        maxWidth: "18rem",
        display: "flex",
        flexDirection: "column"
    }
}))(Card);


const CardHeaderCustom = withStyles((theme) => ({
    root: {
        textAlign: "left",
        height: "4rem",
        alignItems: "baseline",
        justifyContent: "baseline"
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
    }
}))(CardContent);

const CardPresentation = ({ isConditionalSentence = false, traces, mainValue, text = {} }) => {
    const theme = useTheme();


    const { title, subheader, conditionSentence, moreDetails } = text;

    return (
        <CardCustom>
            <CardHeaderCustom
                title={title}
                subheader={subheader}
            />
            <Divider variant="fullWidth" />

            <CardContentCustom>
                <Typography variant="overline" /*color="success"*/>
                    {mainValue}
                </Typography >
                <Typography color="primary">{isConditionalSentence ? conditionSentence : ""}</Typography>
                <Typography component="p">
                    {moreDetails}</Typography>
            </CardContentCustom>
        </CardCustom>
    )
}

export default CardPresentation;
import React from 'react';

import {
    Timer,
    TrendingDown,
    TrendingFlat,
    TrendingUp,
    HourglassFull,
    HourglassEmpty
} from '@material-ui/icons';

import {
    withStyles,
    makeStyles,
    Box,
    Card,
    CardContent,
    List,
    ListItemText,
    ListItem,
    ListItemIcon,
    TableCell,
    TableRow,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Paper,
    Typography
} from '@material-ui/core';

import { fade } from '@material-ui/core/styles/colorManipulator';

import { useTheme } from '@material-ui/styles';

const LABELS = {
    common: {
        duration: "Duration",
        startDateString: "Start",
        endDateString: "End",
        completeAverage: "Average",
        peack: "Peack",
        though: "Though"
    },
    highLoad: {
        displayName: "High Load"
    },
    recovery: {
        displayName: "Recovery"
    },
}


// function ReportTable({ report, index }) {
function ReportTable({ report, index }) {

    const {
        type,
        traces,
        startDateString,
        endDateString,
        peack,
        though,
        completeAverage,
        duration
    } = report;



    const indexDisplay = isNaN(index) ? "" : `n° ${index += 1}`;

    const overview = [
        {
            Icon: Timer,
            label: LABELS.common["duration"],
            value: duration,
            classCus: "colorIconDefault",

        },
        {
            Icon: HourglassEmpty,
            label: LABELS.common["startDateString"],
            value: startDateString,
            classCus: "colorIconDefault"
        },
        {
            Icon: HourglassFull,
            label: LABELS.common["endDateString"],
            value: endDateString,
            classCus: "colorIconDefault"
        },
        {
            Icon: TrendingUp,
            label: LABELS.common["peack"],
            value: peack,
            classCus: "colorIconHighLoad"
        },
        {
            Icon: TrendingDown,
            label: LABELS.common["though"],
            value: though,
            classCus: "colorIconRecovery"
        },
        {
            Icon: TrendingFlat,
            label: LABELS.common["completeAverage"],
            value: completeAverage,
            classCus: "colorIconFlat"
        }
    ]

    const theme = useTheme();

    const useStyles = makeStyles({
        table: {
            minWidth: 700,
        },
        subCategory: {
            backgroundColor: fade(theme.palette.primary.light, .02),
            marginBottom: "2rem"
        },
        list: {
            display: "flex"
        },
        item: {
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            fontSize: "2.5rem"
        },
        fontIcon: {
            fontSize: "2.2rem"
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
    });

    const classes = useStyles();

    const OverviewListIcon = withStyles((theme) => ({
        root: {
            justifyContent: "center"
        },
    }))(ListItemIcon);


    const TableCellCustom = withStyles((theme) => ({
        head: {
            backgroundColor: fade(theme.palette.primary.dark, .5),
            color: theme.palette.primary.contrastText,
        }
    }))(TableCell);

    const TableRowCustom = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
            }
        },
    }))(TableRow);

    const StyledReportCard = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.tile.backgroundColor,
            },
            '&:nth-of-type(even)': {
                backgroundColor: fade(theme.palette.tile.backgroundColor, .8)
            },
            padding: "1rem",
            marginBottom: "1rem"
        },
    }))(Card);

    const StyledListItem = withStyles((theme) => ({
        root: {
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
        }
    }))(ListItem)



    return (
        <StyledReportCard m={6} >
            <Typography align="left" variant="h2" gutterBottom className={classes.subCategory}>
                {LABELS[type].displayName} {indexDisplay}
            </Typography>
            <Card>
                <CardContent>
                    <Typography component="div" align="left" >
                        <List component="ul" direction="row" className={classes.list} >
                            {
                                overview.map(({ Icon, label, value, color, classCus }, index) => {
                                    return (
                                        <StyledListItem key={index}>
                                            <OverviewListIcon className={classes[classCus]} >
                                                <Icon className={classes.fontIcon} />
                                            </OverviewListIcon>
                                            <ListItemText>
                                                <Typography>{label}</Typography>
                                                <Typography>{value}</Typography>
                                            </ListItemText>
                                        </StyledListItem>
                                    )
                                })
                            }
                        </List>
                    </Typography>
                </CardContent>
            </Card>

            <Box mt={5}>
                <Typography align="left" variant="h3" mt={4} color="primary">Traces</Typography>
                <TableContainer component={Paper} >
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRowCustom>
                                <TableCellCustom>Date</TableCellCustom>
                                <TableCellCustom align="center">Average n-1 minute</TableCellCustom>
                                <TableCellCustom align="center">Average n-5 minutes</TableCellCustom>
                                <TableCellCustom align="center">Average n-10 minutes</TableCellCustom>
                            </TableRowCustom>
                        </TableHead>
                        <TableBody>
                            {traces.map((row) => {
                                return (
                                    <TableRowCustom>
                                        <TableCellCustom component="th" scope="row">
                                            {row.dateString}
                                        </TableCellCustom>
                                        <TableCellCustom align="center">{row.loadAverageLast1Min}</TableCellCustom>
                                        <TableCellCustom align="center">{row.loadAverageLast5Mins}</TableCellCustom>
                                        <TableCellCustom align="center">{row.loadAverageLast15Mins}</TableCellCustom>
                                    </TableRowCustom>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </StyledReportCard>
    )
}
export default ReportTable;


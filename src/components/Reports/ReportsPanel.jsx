import React, {
    memo,
    useState
} from 'react'
import ReportTable from "./ReportTable";
import {
    Paper,
    Tabs,
    Tab,
    Typography,
    Avatar,
    Box
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { fade } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';

import { filterArrayOfObjectByProperty } from "../../utilities/utilities";
import * as LABELS from "../../data/labels.json"

const useStyles = makeStyles(theme => {
    return ({
        tabContentTitle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        },
        tabContentTitleFlexStart: {
            justifyContent: "flex-start"
        },
        avatar: {
            display: "flex",
            backgroundColor: theme.palette.primary.darker,
            color: theme.palette.primary.lighter,
            margin: ".5rem"
        },
        event: {
            padding: ".5rem 1rem",
            '&:nth-of-type(odd)': {
                backgroundColor: fade(theme.palette.primary.light, .1),
            },
            '&:nth-of-type(even)': {
                backgroundColor: fade(theme.palette.primary.darker, .1)
            },
        },
        eventTitle: {
            padding: ".5rem 1rem"
        }
    })
});

function WrappedReportsPanel({ reports }) {
    const classes = useStyles();
    const {
        eventsFinalReports
    } = reports;

    const eventsFinalReportsCount = eventsFinalReports?.length || 0;

    let highLoadReports = filterArrayOfObjectByProperty(eventsFinalReports, "highLoadReports");
    let recoveryReports = filterArrayOfObjectByProperty(eventsFinalReports, "recoveryReports");    
    // TABS
    const [currentTabVal, setCurrentTabVal] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setCurrentTabVal(newValue);
    };

    // From Material ui Tab documentation
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={5}>{children}</Box>}
            </Typography>
        );
    }

    const getTabContentTitle = (tabDataType, arrayLength) => {
        return !arrayLength ? LABELS.tableReport.common.noReport : arrayLength && arrayLength > 1 ? LABELS.tableReport[tabDataType].reports : LABELS.tableReport[tabDataType].report
    }
    return (
            <Paper  elevation={2}>
                <Tabs value={currentTabVal}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChangeTab} >
                    <Tab label={LABELS.tableReport.events.tabTitle} />
                    <Tab label={LABELS.tableReport.highLoad.tabTitle} />
                    <Tab label={LABELS.tableReport.recovery.tabTitle} />
                </Tabs>
                <TabPanel value={currentTabVal} index={0}>
                    <Typography className={classes.tabContentTitle} component="div">
                        <Typography className={clsx(classes.tabContentTitle, classes.tabContentTitleFlexStart)} variant="h2">
                            <Avatar classes={{
                                colorDefault: classes.avatar
                            }}>{eventsFinalReportsCount}
                            </Avatar>
                            {getTabContentTitle("events", eventsFinalReportsCount)}
                        </Typography>
                    </Typography>
                    {
                        eventsFinalReports && Object.values(eventsFinalReports).map((currentEvent, index) => {
                            const { highLoadReports, recoveryReports } = currentEvent;
                            return (
                                <div key={index} className={classes.event}>
                                <Typography className={classes.eventTitle} variant="h2">Event n° {index + 1}</Typography>
                                <ReportTable report={highLoadReports} index={index} />
                                <ReportTable report={recoveryReports} m={6} index={index} />
                                </div>
                            )

                        })
                    }
                </TabPanel>
                <TabPanel value={currentTabVal} index={1} >
                    <Typography
                        variant="h2"
                        align="left"
                        className={clsx(classes.tabContentTitle, classes.tabContentTitleFlexStart)}>
                        <Avatar classes={{ colorDefault: classes.avatar }}>
                            {eventsFinalReportsCount}
                        </Avatar>
                        {getTabContentTitle("highLoad", eventsFinalReportsCount)}
                    </Typography>
                    {
                        highLoadReports && highLoadReports.map((report, ind) => <ReportTable key={ind} report={report} index={ind} />)}
                </TabPanel>
                <TabPanel value={currentTabVal} index={2}>
                    <Typography 
                    align="left" 
                    variant="h2" 
                    className={clsx(classes.tabContentTitle, classes.tabContentTitleFlexStart)} >
                        <Avatar classes={{ colorDefault: classes.avatar}}>
                            {eventsFinalReportsCount}
                        </Avatar>
                        {getTabContentTitle("recovery", eventsFinalReportsCount)}
                    </Typography>
                    {
                        recoveryReports && recoveryReports.map((report, ind) => <ReportTable key={ind} report={report} index={ind} />)
                    }
                </TabPanel>
            </Paper>
    );
}



function compareReports(prevProps, nextProps) {
    let prevEventsReports = prevProps.reports.eventsFinalReports;
    let nextEventsReports = nextProps.reports.eventsFinalReports;
    if (nextProps.reports.eventsFinalReports.length) {
        let prevEventsOldestReport = prevEventsReports[0];
        let nextEventsOldestReport = nextEventsReports[0];
        // check if same number of reports than previous 
        let isSameCountOfReports = prevEventsReports.length === nextEventsReports.length;
        // we check if the oldest report is the same (in case of LRU) the count of reports is not enough to attest they are the same
        let isSameOldestReport = prevEventsOldestReport?.highLoadReports.startDateInMs === nextEventsOldestReport.highLoadReports.startDateInMs;
        return isSameCountOfReports && isSameOldestReport;
    } else if(prevEventsReports.length && !nextEventsReports.length) {
        // meaning the LRU has been reset. Condition needed to remove the event report
        return false;
    } else {
        return true
    }
}

export const ReportsPanel = memo(WrappedReportsPanel, compareReports);
export default ReportsPanel;

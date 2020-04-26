import React, {
    memo,
    useState,
    Fragment
} from 'react'
import ReportTable from "./ReportTable"
import {
    Paper,
    Tabs,
    Tab,
    Typography,
    Avatar,
    Box
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

import { filterArrayOfObjectByProperty } from "../../utilities/utilities"
import * as fakedata from "../../data/fakeData.json"

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
        }
    })
});

function WrappedReportsPanel({ reports }) {
    const classes = useStyles();
    const {
        eventsFinalReports
    } = reports;

    // Fake data
    // const eventsFinalReports = fakedata.eventsFinalReports;
    // const eventsFinalReportsCount = fakedata.eventsFinalReports.length;
    // const highLoadFinalReportsCount = fakedata.highLoadFinalReports.length;
    // const highLoadFinalReports = fakedata.highLoadFinalReports;
    // const recoveryFinalReports = fakedata.recoveryFinalReports;
    // const recoveryFinalReportsCount = fakedata.highLoadFinalReports.length;

    const eventsFinalReportsCount = eventsFinalReports?.length || 0;

    const LABELS = {
        common: {
            noReport: "There is no Report yet",
        },
        events: {
            tabTitle: "All Events Reports",
            report: "Event Report",
            reports: "Events Reports",
        },
        highLoad: {
            tabTitle: "High Load Average Reports",
            report: "High Load Report",
            reports: "High Load Reports",
        },
        recovery: {
            tabTitle: "Recovery Reports",
            report: "Recovery Report",
            reports: "Recovery Reports",
        }
    }

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
        return !arrayLength ? LABELS.common.noReport : arrayLength && arrayLength > 1 ? LABELS[tabDataType].reports : LABELS[tabDataType].report
    }
    return (
            <Paper  elevation={2}>
                <Tabs value={currentTabVal}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChangeTab} >
                    <Tab label={LABELS.events.tabTitle} />
                    <Tab label={LABELS.highLoad.tabTitle} />
                    <Tab label={LABELS.recovery.tabTitle} />
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
                            return (<Fragment key={index}>
                                <ReportTable report={highLoadReports} index={index} />
                                <ReportTable report={recoveryReports} m={6} index={index} />
                            </Fragment>)

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

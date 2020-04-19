import React, {
    useState,
    useEffect,
    Fragment
} from 'react'
import ReportTable from "./ReportTable"
import { Paper, Tabs, Tab, Typography, Container, Avatar, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Box, Button } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

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
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            margin: ".5rem"
        }
    })
});

function ReportsPanel({ reports }) {
    const classes = useStyles();
    const {
        eventsFinalReports,
        highLoadFinalReports,
        recoveryFinalReports
    } = reports;

    // Fake data
    // const eventsFinalReports = fakedata.eventsFinalReports;
    // const eventsFinalReportsCount = fakedata.eventsFinalReports.length;
    // const highLoadFinalReportsCount = fakedata.highLoadFinalReports.length;
    // const highLoadFinalReports = fakedata.highLoadFinalReports;
    // const recoveryFinalReports = fakedata.recoveryFinalReports;
    // const recoveryFinalReportsCount = fakedata.highLoadFinalReports.length;

    const eventsFinalReportsCount = eventsFinalReports?.length
    const highLoadFinalReportsCount = highLoadFinalReports?.length
    const recoveryFinalReportsCount = recoveryFinalReports?.length

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


    // const initializeExpandedPanelsStatus = arr => {
    //     //booolean will be coming from switch
    //     let newArr = Array(arr.length).fill(false);
    //     return newArr;
    // }

    // const updateExpandedPanelsStatus = arr => {
    //     // caution withn history, test if well update
    //     if (arr.length === expandedPanelsStatus.length) {
    //         console.log("same length, nothing to change")
    //         return;
    //     } else {
    //         console.log("modification needed");
    //         let newArray = [...arr, false];
    //         setExpandedPanelsStatus(newArray)
    //     }
    // }

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
        <Fragment>
            <Paper square>
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
                    <Typography variant="h2" align="left" className={clsx(classes.tabContentTitle, classes.tabContentTitleFlexStart)}>
                        <Avatar classes={{
                            colorDefault: classes.avatar
                        }}>{highLoadFinalReportsCount}
                        </Avatar>
                        {getTabContentTitle("highLoad", highLoadFinalReportsCount)}
                    </Typography>
                    {
                    highLoadFinalReports && highLoadFinalReports.map((report, ind) => <ReportTable key={ind} report={report} index={ind} />)}
                </TabPanel>

                <TabPanel value={currentTabVal} index={2}>
                    <Typography align="left" variant="h2" className={clsx(classes.tabContentTitle, classes.tabContentTitleFlexStart)} >
                        <Avatar classes={{
                            colorDefault: classes.avatar
                        }}>{recoveryFinalReportsCount}
                        </Avatar>
                        {getTabContentTitle("recovery", recoveryFinalReportsCount)}
                    </Typography>
                    {
                    recoveryFinalReports && recoveryFinalReports.map((report, ind) => <ReportTable key={ind} report={report} index={ind} />)
                    }

                </TabPanel>
            </Paper>

        </Fragment >
    );
}




export default ReportsPanel;

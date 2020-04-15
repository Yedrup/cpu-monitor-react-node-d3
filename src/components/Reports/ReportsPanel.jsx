import React, {
    useContext,
    useState,
    useEffect,
    Fragment
} from 'react'
import { Paper, Tabs, Tab, Typography, Avatar, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Box, Button } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";

import { DataContext } from '../../data/reducers/DataContext';
import * as fakedata from "../../data/fakeData.json"

const useStyles = makeStyles(theme => {
    console.log("theme", theme)
    return ({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        },
        avatar: {
            display: "flex",
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            margin: ".5rem"
        }
    })
});

function ReportsPanel() {
    const classes = useStyles();
    const {
        stateData: {
            eventsFinalReports,
            highLoadFinalReports,
            recoveryFinalReports
        }
    } = useContext(DataContext);

    // TABS
    const [currentTabVal, setCurrentTabVal] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setCurrentTabVal(newValue);
    };
    //EXPAND
    const [expanded, setExpanded] = useState(false);
    const handleChangeExpand = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);

    };

    const handleExpandAll = (event) => {
        console.log("event", event)
    }

    //Fake data
    const fakeEventsFinalReports = fakedata.eventsFinalReports;
    const fakeHighLoadFinalReports = fakedata.highLoadFinalReports;
    const fakeRecoveryFinalReports = fakedata.recoveryFinalReports;


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

    useEffect(() => {
        return () => null
    }, [eventsFinalReports, highLoadFinalReports, recoveryFinalReports])


    return (
        <Fragment>
            <Paper square>
                <Tabs value={currentTabVal}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={handleChangeTab} >
                    <Tab label="All Events Reports" />
                    <Tab label="High Load Average Reports" />
                    <Tab label="Recovery Reports" />
                </Tabs>
                <TabPanel value={currentTabVal} index={0}>
                    {/* create component */}
                    <Typography className={classes.root} variant="h2">
                        <Avatar classes={{
                            colorDefault: classes.avatar
                        }}>{fakeEventsFinalReports.length}
                        </Avatar>
                        All Events Reports
                        <Button variant="contained" color="primary" onClick={handleExpandAll}>Toggle all</Button>
                    </Typography>

                    {Object.values(fakeEventsFinalReports).map((currentEvent, index) => {
                        const { highLoadReports, recoveryReports } = currentEvent;
                        //TODO: create external components : report +  coponent trace
                        return (
                            <Fragment>
                                <ExpansionPanel
                                    TransitionProps={{ unmountOnExit: true }}
                                    expanded={expanded === `panel${index + 1}`}
                                    onChange={handleChangeExpand(`panel${index + 1}`)}
                                    key={index}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMore />}
                                        variant="fullWidth"
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6" color="secondary" >
                                            Event {index + 1}</Typography>
                                        {/*TODO: format date */}
                                        <span>started {highLoadReports.startDateString}</span> - <span>finished - {recoveryReports.endDateString} </span>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography component="div">
                                            <Box component="span" p={1}>
                                                <Typography color="secondary">High Load</Typography>
                                                {highLoadReports.traces.map(currentTrace => {
                                                   return (
                                                        <div>
                                                            <p>{currentTrace.loadAverageLast1Min}</p>
                                                        </div>
                                                    )
                                                })}
                                                <Typography color="secondary">Recovery</Typography>
                                                {recoveryReports.traces.map(currentTrace => {
                                                    return (
                                                        <div>
                                                            <p>{currentTrace.loadAverageLast1Min}</p>
                                                        </div>
                                                    )
                                                })}
                                            </Box>
                                        </Typography>

                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Fragment>
                        )
                    })}

                </TabPanel>
                <TabPanel value={currentTabVal} index={1}>
                    <Typography className={classes.root} variant="h2">
                        <Avatar classes={{
                            colorDefault: classes.avatar
                        }}>{fakeHighLoadFinalReports.length}
                        </Avatar>
                        High Load Average Reports
                        <Button variant="contained" color="primary" onClick={handleExpandAll}>Toggle all</Button>
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTabVal} index={2}>
                    <Typography className={classes.root} variant="h2">
                        <Avatar classes={{
                            colorDefault: classes.avatar
                        }}>{fakeRecoveryFinalReports.length}
                        </Avatar>
                        Recovery Reports
                        <Button variant="contained" color="primary" onClick={handleExpandAll}>Toggle all</Button>
                    </Typography>
                </TabPanel>
            </Paper>

        </Fragment >
    );


}


export default ReportsPanel

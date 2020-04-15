import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import { DataContext } from "../data/reducers/DataContext";
import ConfigPanel from "./ConfigPanel";
import CpuInfo from "./CpuInfoPanel";
import Notification from "./Notifaction";
import Chart from './Chart/Chart';
import ReportsPanel from './Reports/ReportsPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Main() {

  const classes = useStyles();
  const { stateData } = useContext(DataContext);
  let dataToDisplay = stateData.traces.filter((curr, ind) => ind === stateData.traces.length - 1);
  return (
    <main className={classes.root}>
      <Notification />
      <Grid container
        display="flex"
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={4} >
        <Grid item xs={12} sm={12} md={8} >
          <Chart width="700" height="500" />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <ConfigPanel />
          <CpuInfo />
        </Grid>
        <Grid item xs={12} sm={12} md={8} >
          <ReportsPanel />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Paper className={classes.paper}>
            <p>last minute average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast1Min}</p>
            <p>last 5 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast5Mins}</p>
            <p>last 15 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast15Mins}</p>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
}

export default Main;
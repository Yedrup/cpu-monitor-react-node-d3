import React, {
  useContext, useEffect, useState, memo,
  useCallback,
  useMemo
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, List, withWidth } from '@material-ui/core';
import { DataStateContext, DataDispatchContext } from "../data/reducers/DataContext";
import ConfigPanel from "./ConfigPanel";
import CpuInfo from "./CpuInfoPanel";
import Notification from "./Notifaction";
import Chart from './Chart/Chart';
import ReportsPanel from './Reports/ReportsPanel';
import CardCurrentAverage from "./Cards/CardCurrentAverage"
import CardLastXMin from "./Cards/CardLastXmin"
import CardCountTimeAverageRecov from "./Cards/CardCountTimeAverage"
import CardCountTimeAverageHL from "./Cards/CardCountTimeAverageHL"

// TODO: a component card
const createCardStyle = theme => {
  return ({
    card: {
      margin: 16,
      maxWidth: "20rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  })
}

const useStyles = makeStyles((theme) => {
  let cardStyle = createCardStyle(theme);
  return ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    ...cardStyle
  })
});

function Main(props) {

  const { width: currentBreakpoint } = props;
  const { stateData: {
    traces,
    eventsFinalReports,
    highLoadFinalReports,
    recoveryFinalReports
  }
  } = useContext(DataStateContext);


  let lastTrace = traces[traces?.length - 1];

  const classes = useStyles();


  const [currentChartSize, setcurrentChartSize] = useState({})
  // hack to get the svg size responsive
  const chartSizesVal = {
    xs: {
      width: "500",
      height: "500"
    },
    sm: {
      width: "740",
      height: "500"
    },
    md: {
      width: "600",
      height: "545"
    },
    lg: {
      width: "800",
      height: "545"
    },
    xl: {
      width: "800",
      height: "545"
    }

  }

  useEffect(() => {
    setcurrentChartSize({ ...chartSizesVal[currentBreakpoint] })
    return () => null
  }, [currentBreakpoint])

  return (
    <Grid container spacing={3} >

      <Notification />
      <Grid container item spacing={3} direction="row" justify="space-between">
        <Grid component={Card} item xs={2} className={classes.card} >
          <CardCurrentAverage lastTrace={{ ...lastTrace }} />
        </Grid>
        <Grid item component={Card} className={classes.card} xs={2}>
          <CardLastXMin lastTrace={{ ...lastTrace }} />
        </Grid>
        <Grid item component={Card} className={classes.card} xs={4}>
          <CardCountTimeAverageRecov lastTrace={{ ...lastTrace }} />
        </Grid>
        <Grid item component={Card} className={classes.card} xs={4}>
          <CardCountTimeAverageHL lastTrace={{ ...lastTrace }} />
        </Grid>
      </Grid>

      <Grid container item spacing={3} direction="row" justify="flex-start">
        <Grid item xs={12} sm={12} md={8} >
          <Chart width={currentChartSize.width} height={currentChartSize.height} />
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <ConfigPanel />
          <CpuInfo />
        </Grid>
        <Grid item xs={12} sm={12} md={12} >
          <ReportsPanel reports={{
            eventsFinalReports,
            highLoadFinalReports,
            recoveryFinalReports
          }} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withWidth()(Main);
import React, {
  useContext, useEffect, useState, useMemo
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, List, withWidth, withStyles } from '@material-ui/core';
import { DataStateContext, DataDispatchContext } from "../data/reducers/DataContext";
import { NotificationContext } from "../data/reducers/NotificationContext";
import ConfigPanel from "./ConfigPanel";
import CpuInfo from "./CpuInfoPanel";
import Notification from "./Notifaction";
import Chart from './Chart/Chart';
import ReportsPanel from './Reports/ReportsPanel';
import CardPresentation from "./Cards/CardPresentation";

import { ConfigContext } from '../data/reducers/ConfigContext';

import * as LABELS from "../data/labels?.json";

const useStyles = makeStyles({
  main: {
    marginTop: "2rem",
  }
});


function Main(props) {
  const { width: currentBreakpoint } = props;
  const { stateData: {
    traces,
    eventsFinalReports,
    highLoadFinalReports,
    recoveryFinalReports,
    isHighLoadCurrentlyInProgress,
    isLastAverageWindowAnEstimate,
    lastWindowAverage
  }

  } = useContext(DataStateContext);
  const { stateConfig, dispatchConfig } = useContext(ConfigContext);
  const { stateNotification, dispatchNotification } = useContext(NotificationContext)


  // hack to get the svg size responsive
  const [currentChartSize, setcurrentChartSize] = useState({})
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

  const timeWindowInMin = stateConfig.getTimeWindowInMin();
  let lastTrace = traces[traces?.length - 1] || {};
  let highLoadCount = isHighLoadCurrentlyInProgress ? highLoadFinalReports.length + 1 : highLoadFinalReports.length;
  let recoveryCount = recoveryFinalReports.length;
  const { loadAverageLast1Min = 0 } = lastTrace;

  let updateTextObjForWindowAverage = (textObj, timeWindowInMin) => {
    return {
      ...textObj,
      title: `${textObj.title} ${timeWindowInMin} minutes`
    }
  }
  let updatedTextObjForWindowAverage = useMemo(() => updateTextObjForWindowAverage(LABELS.cardsPresentation.windowAverage, timeWindowInMin), [timeWindowInMin])

  const classes = useStyles();
  return (
    <Grid
      container
      spacing={3}
      className={classes.main}>

      <Notification
        stateNotification={stateNotification}
        dispatchNotification={dispatchNotification} />

      <Grid
        container
        item
        spacing={3}
        direction="row"
        justify="space-between"
        mt={15}>

        <Grid
          component={CardPresentation}
          item
          xs={2}
          lastTrace={{ ...lastTrace }}
          mainValue={loadAverageLast1Min}
          text={LABELS?.cardsPresentation.currentAverage}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={2}
          lastTrace={{ ...lastTrace }}
          mainValue={lastWindowAverage}
          isConditionalSentence={isLastAverageWindowAnEstimate}
          text={updatedTextObjForWindowAverage}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={4}
          traces={traces}
          isConditionalSentence={isHighLoadCurrentlyInProgress}
          text={LABELS?.cardsPresentation.countHighLoad}
          mainValue={highLoadCount}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={4}
          lastTrace={{ ...lastTrace }}
          mainValue={recoveryCount}
          text={LABELS?.cardsPresentation.countRecovery}>
        </Grid>

      </Grid>

      <Grid
        container
        item
        spacing={3}
        direction="row"
        justify="flex-start">

        <Grid
          item
          xs={12}
          sm={12}
          md={8} >
          <Chart
            width={currentChartSize.width}
            height={currentChartSize.height} />
        </Grid>

        <Grid item xs={12} sm={5} md={4}>
          <ConfigPanel
            stateConfig={stateConfig}
            dispatchConfig={dispatchConfig} />
          <CpuInfo />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12} >
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
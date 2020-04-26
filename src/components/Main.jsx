import React, {
  useContext, useEffect, useState, useMemo
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, withWidth } from '@material-ui/core';
import { DataStateContext } from "../data/reducers/DataContext";
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
    marginTop: "1rem",
  }
});


function Main(props) {
  const { width: currentBreakpoint } = props;
  const { stateData: {
    traces,
    eventsFinalReports,
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
      width: "800",
      height: "500"
    },
    md: {
      width: "800",
      height: "500"
    },
    lg: {
      width: "800",
      height: "500"
    },
    xl: {
      width: "800",
      height: "580"
    }

  }
  useEffect(() => {
    setcurrentChartSize({ ...chartSizesVal[currentBreakpoint] })
    return () => null
    //eslint-disable-next-line
  }, [currentBreakpoint])

  const timeWindowInMin = stateConfig.getTimeWindowInMin();
  let lastTrace = traces[traces?.length - 1] || {};
  let highLoadCount = isHighLoadCurrentlyInProgress ? eventsFinalReports?.length + 1 : eventsFinalReports?.length || 0;
  let recoveryCount = eventsFinalReports?.length || 0;
  const { loadAverageLast1Min = 0 } = lastTrace;

  let updateTextObjForWindowAverage = (textObj, timeWindowInMin) => {
    return {
      ...textObj,
      title: `${textObj.title} ${timeWindowInMin} minutes`
    }
  }
  const updatedTextObjForWindowAverage = useMemo(() => updateTextObjForWindowAverage(LABELS.cardsPresentation.windowAverage, timeWindowInMin), [timeWindowInMin])

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
        direction="row"
        justify="space-between">

        <Grid
          component={CardPresentation}
          item
          xs={6}
          sm={2}
          lastTrace={{ ...lastTrace }}
          mainValue={loadAverageLast1Min}
          text={LABELS?.cardsPresentation.currentAverage}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={6}
          sm={2}
          lastTrace={{ ...lastTrace }}
          mainValue={lastWindowAverage}
          isConditionalSentence={isLastAverageWindowAnEstimate}
          text={updatedTextObjForWindowAverage}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={6}
          sm={2}
          traces={traces}
          isConditionalSentence={isHighLoadCurrentlyInProgress}
          text={LABELS?.cardsPresentation.countHighLoad}
          mainValue={highLoadCount}>
        </Grid>

        <Grid
          component={CardPresentation}
          item
          xs={6}
          sm={2}
          lastTrace={{ ...lastTrace }}
          mainValue={recoveryCount}
          text={LABELS?.cardsPresentation.countRecovery}>
        </Grid>

      </Grid>

      <Grid
        container
        item
        display="flex"
        spacing={3}
        direction="row"
        justify="flex-start">

        <Grid
          item
          xs={12}
          md={8}
        >
          <Chart
            width={currentChartSize.width}
            height={currentChartSize.height}
          />
        </Grid>

        <Grid 
        item 
        xs={12} 
        md={4}
        >
          <ConfigPanel
            stateConfig={stateConfig}
            dispatchConfig={dispatchConfig} />
          <CpuInfo />
        </Grid>
        <Grid
          item
          xs={12}>
          <ReportsPanel reports={{
            eventsFinalReports
          }} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withWidth()(Main);
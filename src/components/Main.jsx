import React, { useContext } from 'react';
import { DataContext } from "../data/reducers/DataContext";
import ConfigPannel from "./ConfigPannel";
import CpuInfo from "./CpuInfo";
import Notification from "./Notifaction";
import Chart from './Chart/Chart';

function Main() {
  const { stateData } = useContext(DataContext);
  let dataToDisplay = stateData.traces.filter((curr, ind) => ind === stateData.traces.length - 1)
  return (
      <main>
        <Notification/>
        <Chart width="800" height="600" />
        <ConfigPannel />
        <CpuInfo />
        <p>last minute average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast1Min}</p>
        <p>last 5 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast5Mins}</p>
        <p>last 15 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast15Mins}</p>
      </main>
  );
}

export default Main;

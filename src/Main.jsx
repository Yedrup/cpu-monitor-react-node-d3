import React, { useContext } from 'react';
import { DataContext } from "./data/reducers/DataContext";
import ConfigPannel from "./components/ConfigPannel";
import CpuInfo from "./components/CpuInfo";
import Notification from "./components/Notifaction";

function Main() {
  const { stateData } = useContext(DataContext);
  let dataToDisplay = stateData.traces.filter((curr, ind) => ind === stateData.traces.length - 1)
  return (
      <main>
        <Notification/>
        <ConfigPannel />
        <CpuInfo />
        <p>last minute average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast1Min}</p>
        <p>last 5 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast5Mins}</p>
        <p>last 15 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast15Mins}</p>
      </main>
  );
}

export default Main;

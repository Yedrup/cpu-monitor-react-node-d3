import React, { useContext } from 'react';
import './App.css';
import { RequestStatusContext } from './context/RequestStatusContext';
import { DataContext } from "./reducers/DataContext";
import { ConfigContext } from "./reducers/ConfigContext";
import Header from "./components/Header";
import ConfigPannel from "./components/ConfigPannel";
import CpuInfo from "./components/CpuInfo";

function App() {

  const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
  const { stateConfig, dispatchConfig } = useContext(ConfigContext);
  const { stateData, dispatchData } = useContext(DataContext);

  let dataToDisplay = stateData.traces.filter((curr, ind) => ind === stateData.traces.length - 1)
  return (
    <div className="App">
      <Header className="App-header" />
      <ConfigPannel />
      <CpuInfo />
      <p>last minute average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast1Min}</p>
      <p>last 5 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast5Mins}</p>
      <p>last 15 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast15Mins}</p>
    </div>
  );

}

export default App;

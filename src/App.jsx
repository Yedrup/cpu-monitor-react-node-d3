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
  const {stateConfig, dispatchConfig} = useContext(ConfigContext);
  const { stateData, dispatchData } = useContext(DataContext);

  console.log(stateData);
  // const [cpuData, setCpuData] = useState({
    //   loadAverageLast1Min: null,
    //   loadAverageLast5Mins: null,
  //   loadAverageLast15Mins: null,
  //   timeStampInMs: null
  // });
  // // saved data into the array of Trace
  // const [traces, setTraces] = useState([]); // ARRAY OF TRACES
  // // is there a current high average
  // const [isHighloadAverage, setIsHighloadAverage] = useState(false);

  // // keep history of x element
  // const manageTracesLRU = (traces, newTrace) => {
  //   let updatedTraces = [...traces, newTrace];
  //   //LRU
  //   if (updatedTraces.length > config.timeWindowArrayLength) {
  //     // if usage of config, see to slice if new timeWindowArrayLength is smaller
  //     updatedTraces.shift();
  //   }
  //   return updatedTraces;
  // }

  // const controlTrace = (traces, newTrace) => {
  //   console.log("controlTrace ===>", traces, newTrace);
  //   const isHigherThanAverage = newTrace.loadAverageLast1Min > config.cpuLoadConsiredAsHigh;
  //   if (isHigherThanAverage) {
  //     console.log("SUPPOSE TO MANAGE IT, isHigherThanAverage check trace of prev data");
  //     setIsHighloadAverage(true);
  //   } else {
  //     console.log("no worry kido");
  //     let previousTrace = traces.length - 2 ? traces[traces.length - 2] : null;
  //     if (previousTrace) {
  //       console.log("previousTrace loadAverageLast1Min", previousTrace.loadAverageLast1Min)
  //       console.log("previousTrace.loadAverageLast1Min > config.cpuLoadConsiredAsHigh", previousTrace.loadAverageLast1Min > config.cpuLoadConsiredAsHigh)
  //     }
  //   }
  // }

  // // HIGH
  // useEffect(() => {
  //   if (isHighloadAverage) {
  //     console.log("useEffect - isHighloadAverage alert!!!!!!!!!!!!!!!!!!!!!! ");
  //     let previousTrace = traces.length - 2 ? traces[traces.length - 2] : null;
  //     console.log(previousTrace);
  //     if (previousTrace) {
  //       console.log("previousTrace loadAverageLast1Min", previousTrace.loadAverageLast1Min)
  //       console.log("previousTrace.loadAverageLast1Min > config.cpuLoadConsiredAsHigh", previousTrace.loadAverageLast1Min > config.cpuLoadConsiredAsHigh)
  //     }
  //   }
  //   return () => null;
  // }, [isHighloadAverage])


  // //HERE TO START USING TWO LOGICS : LRU || ALERTS
  // useEffect(() => {
  //   console.log("useEffect -  cpuDATA updated: ", cpuData.loadAverageLast1Min)
  //   let newTrace = new Trace(cpuData);
  //   setTraces(traces => cpuData.loadAverageLast1Min ? manageTracesLRU(traces, newTrace) : []);
  //   return () => null;
  // }, [cpuData])


  // // traces updated
  // useEffect(() => {
  //   console.log("useEffect - traces updated: ", traces);
  //   if (traces.length) controlTrace(traces, traces[traces.length - 1]);
  //   return () => null;
  // }, [traces])


  // // request load average
  // useEffect(() => {
  //   if (isRequesting) {
  //     console.log("requesting...");
  //     callApi("api/cpu/averages").then(data => {
  //       setCpuData(data);
  //       setIsRequesting(false);
  //     });
  //   }
  //   return () => null;
  // }, [isRequesting]);

  // // setInterval
  // useEffect(() => {
  //   console.log("useEffect = CONFIG HAS CHANGED ==>", config);
  //   const interval = setInterval(() => {
  //     setIsRequesting(true);
  //   }, config.intervalInMs);
  //   return () => clearInterval(interval);
  // }, [config]);


  // let { loadAverageLast1Min, loadAverageLast5Mins, loadAverageLast15Mins } = cpuData;       letDataToDisplay = stateData.traces.filter((curr,ind) => ind === stateData.traces.length -1)
  let dataToDisplay = stateData.traces.filter((curr,ind) => ind === stateData.traces.length -1)
  console.log("dataToDisplay",dataToDisplay);
  return (
      <div className="App">
        <Header className="App-header" />
        <ConfigPannel />
        <CpuInfo />

        {/* <button onClick={() =>
          setConfig(old => {
            console.log("old", old)
            let updatedIntervalInMs = 3000;
            return { ...old, intervalInMs: updatedIntervalInMs };
          })}>change interval in ms</button>*/}
        <p>last minute average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast1Min}</p>
        <p>last 5 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast5Mins}</p>
        <p>last 15 minutes average: {dataToDisplay.length && dataToDisplay[0].loadAverageLast15Mins}</p>
      </div>
  );

}

export default App;

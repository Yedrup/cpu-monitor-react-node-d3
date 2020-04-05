import React, { useState, useEffect } from 'react';
import {
  callApi,
  convertMinInMs,
  convertSecInMs
} from "./utilities/utilities";
import './App.css';

function App() {

  // evaluate begin and end of request to trigger use effect
  const [isRequesting, setIsRequesting] = useState(true);
  //cpu info 
  const [cpuInfo, setCpuInfo] = useState({
    cpusCount: null,
    cpusList: []
  });
  useEffect(() => {
    callApi("api/cpu/info").then(info => setCpuInfo(info));
  }, [])


  // just the data returned from api
  const [cpuData, setCpuData] = useState({
    loadAverageLast1Min: null,
    loadAverageLast5Mins: null,
    loadAverageLast15Mins: null,
    timeStampInMs: null
  });

  // saved data into the array of Trace
  const [traces, setTraces] = useState([]); // ARRAY OF TRACES


  class Config {
    constructor(intervalInMs = 10000 /*10sec*/, windowInMs = 180000 /*10 min*/) {
      this.intervalInMs = intervalInMs;
      this.windowInMs = windowInMs;
      this.windowArrayLength = Math.round(this.windowInMs / this.intervalInMs);
    }
  }

  let currConfig = new Config();
  // config 
  const [config, setConfig] = useState(currConfig);

  class Trace {
    constructor(cpuData) {
      let date = new Date(cpuData.timeStampInMs);
      this.date = date;
      this.dateInMillisecond = cpuData.timeStampInMs;
      this.loadAverageLast1Min = cpuData.loadAverageLast1Min;
      this.loadAverageLast5Mins = cpuData.loadAverageLast5Mins;
      this.loadAverageLast15Mins = cpuData.loadAverageLast15Mins;
    }
  }

  // keep history of x element
  const manageTracesLRU = (traces, newTrace) => {
    let updatedTraces = [...traces, newTrace];
    //LRU
    if (updatedTraces.length > config.windowArrayLength) {
      // if usage of config, see to slice if new windowArrayLength is smaller
      updatedTraces.shift();
    } 
    return updatedTraces;
  }

  //HERE TO START USING TWO LOGICS : LRU || ALERTS
  useEffect(() => {
    console.log("useEffect -  cpuDATA updated: ", cpuData.loadAverageLast1Min)
    let newTrace = new Trace(cpuData);
    const isHigherThanAverage = cpuData.loadAverageLast1Min > 1;
    if (isHigherThanAverage) console.log("SUPPOSE TO MANAGE IT, isHigherThanAverage check trace of prev data");
    setTraces(traces => cpuData.loadAverageLast1Min ? manageTracesLRU(traces, newTrace) : []);
    return () => null;
  }, [cpuData])


  // traces updated
  useEffect(() => {
    console.log("useEffect - traces updated: ", traces);
    return () => null;
  }, [traces])


  // request load average
  useEffect(() => {
    if (isRequesting) {
      console.log("requesting...");
      callApi("api/cpu/averages").then(data => {
        setCpuData(data);
        setIsRequesting(false);
      });
    }
    return () => null;
  }, [isRequesting]);

  // setInterval
  useEffect(() => {
    console.log("useEffect = config ==>", config);
    const interval = setInterval(() => {
      setIsRequesting(true);
    }, config.intervalInMs);
    return () => clearInterval(interval);
  }, [config]);


  let { loadAverageLast1Min, loadAverageLast5Mins, loadAverageLast15Mins } = cpuData;
  let { cpusCount, cpusList } = cpuInfo;

  return (
    <div className="App">
      <header className="App-header">
        CPU MONITOR
        </header>

      <div>
        <h2>CPUS INFO</h2>
        <ul className="cpu-info">
          <li>CPU Number: {cpusCount}</li>
          {cpusList.map((cpu, index) => {
            return (
              <li key={index}>
                <span>cpu n°{index} </span>
                <span>model:{cpu.model} </span>
                <span>speed:{cpu.speed}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <button onClick={() =>
        setConfig(old => {
          console.log("old", old)
          let updatedIntervalInMs = 3000;
          return { ...old, intervalInMs: updatedIntervalInMs };
        })}>change interval in ms</button>
      <p>last minute average: {loadAverageLast1Min}</p>
      <p>last 5 minutes average: {loadAverageLast5Mins}</p>
      <p>last 15 minutes average: {loadAverageLast15Mins}</p>
    </div>
  );

}

export default App;

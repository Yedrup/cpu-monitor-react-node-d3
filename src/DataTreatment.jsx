import React, { createContext, useState, useEffect, useContext, useReducer } from 'react';
import {
    callApi
} from "./utilities/utilities";
import Trace from "./classes/Trace";
import { RequestStatusContext } from './context/RequestStatusContext';
import { DataContext } from "./reducers/DataContext";
import { ConfigContext } from "./reducers/ConfigContext";



function DataTreatment() {
    const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
    const { dispatchData,stateData } = useContext(DataContext);
    const {stateConfig, dispatchConfig} = useContext(ConfigContext);
    const [cpuData, setCpuData] = useState({
        loadAverageLast1Min: null,
        loadAverageLast5Mins: null,
        loadAverageLast15Mins: null,
        timeStampInMs: null
    });

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

    useEffect(() => {
        // console.log("useEffect -  cpuDATA updated: ", cpuData.loadAverageLast1Min)
        let newTrace = new Trace(cpuData);
        // console.log("newtrace", newTrace)
        let updatedTraces = cpuData.loadAverageLast1Min ? manageTracesLRU(stateData.traces, newTrace) : [];
        dispatchData({
            type: 'UPDATE_TRACES',
            payload: updatedTraces
        })
        return () => null;
    }, [cpuData])


    const manageTracesLRU = (traces, newTrace) => {
        let updatedTraces = [...traces, newTrace];
        let maxLength = stateConfig.getTimeWindowArrayLength();
        console.log("timeWindowArrayLength", maxLength)
        if (updatedTraces.length > maxLength) {
            // if update config, see to slice if new timeWindowArrayLength is smaller
            updatedTraces.shift();
        }
        return updatedTraces;
    }

    return (null);

}

export default DataTreatment;
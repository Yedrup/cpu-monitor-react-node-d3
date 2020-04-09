import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    callApi
} from "./utilities/utilities";
import Trace from "./classes/Trace";
import Report from "./classes/Reports";
import { RequestStatusContext } from './context/RequestStatusContext';
import { DataContext } from "./reducers/DataContext";
import { ConfigContext } from "./reducers/ConfigContext";



function DataTreatment() {
    const isInitialMount = useRef(true);

    const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
    const { dispatchData, stateData } = useContext(DataContext);
    const { stateConfig } = useContext(ConfigContext);
    const [cpuData, setCpuData] = useState({});

    //STEP 0 HIGH LOAD AVERAGE - suspected 
    const [isHighLoadAverageSuspected, setIsHighLoadAverageSuspected] = useState(false);
    const [highLoadAverageSuspected, setHighLoadAverageSuspected] = useState([]);

    // STEP 1: HIGH LOAD AVERAGE - suspected  / RECOVERY - suspected
    //  high load confirmed
    const [isHighLoadAverageConfirmed, setIsHighLoadAverageConfirmed] = useState(false);
    const [highLoadAverageConfirmed, setHighLoadAverageConfirmed] = useState([]);
    // recovery suspected
    const [isRecoveryAverageSuspected, setIsRecoveryAverageSuspected] = useState(false);
    const [recoveryAverageSuspected, setRecoveryAverageSuspected] = useState([]);

    //STEP 2 RECOVERING AVERAGE confirmed
    const [isRecoveryAverageConfirmed, setIsRecoveryAverageConfirmed] = useState(false);
    const [recoveryAverageConfirmed, setRecoveryAverageConfirmed] = useState([]);

    // STEPS 
    const [currentStep, setCurrentStep] = useState(null); // default null
    const steps = [
        {
            state: highLoadAverageSuspected, // Maybe incicent  // graph something kind of blury
            update: setHighLoadAverageSuspected,
        },
        {
            state: highLoadAverageConfirmed, // high load average confirmed ....  recovery suspected treated same time as high load average confirmed
            update: setHighLoadAverageConfirmed, //alert
        },
        {
            state: recoveryAverageConfirmed,// alert, finish , report
            update: setRecoveryAverageConfirmed
        }
    ];

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
        let newTrace = new Trace(cpuData);
        let updatedTraces = cpuData.loadAverageLast1Min ? manageTracesLRU(stateData.traces, newTrace) : [];
        dispatchData({
            type: 'UPDATE_TRACES',
            payload: updatedTraces
        })
        controlTrace(stateData.traces, newTrace);
        return () => null;
    }, [cpuData])
    useEffect(() => {
        console.log("current step changed", currentStep)
        return () => null;
    }, [currentStep])


    /********* ALGO STEPS*/

    //🔶👀 STEP 1 _ SUSPECT HIGH LOAD AVERAGE
    //HIGH LOAD AVERAGE supected
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (!isHighLoadAverageSuspected) {
                console.log("RESET High LoadAverage Suspected");
                setHighLoadAverageSuspected([]);
                if (currentStep === 0) setCurrentStep(null)
            } else {
                console.log("🔶👀 IS HIGH LOAD SUSPECTED");
                setCurrentStep(0)
            }
        }
        return () => null;
    }, [isHighLoadAverageSuspected])
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (isHighLoadAverageSuspected) {
                console.log("🔶👀 HIGH LOAD SUSPECTED ARRAY", highLoadAverageSuspected);
                let currentSuspectedWindowAverage = parseFloat(calculateTracesArrayAverage(highLoadAverageSuspected));
                let isWindowMinToConfirmHighAverageReached = highLoadAverageSuspected.length >= stateConfig.getHighLoadAverageMinArrayLength();
                let isCurrentlyInHighAverage = currentSuspectedWindowAverage > stateConfig.cpuLoadConsiredAsHigh;

                if (isCurrentlyInHighAverage) {
                    if (isWindowMinToConfirmHighAverageReached) {
                        setIsHighLoadAverageConfirmed(true);
                    }
                } else {
                    setIsHighLoadAverageSuspected(false); // meaning that the average decreased 
                }
            }
        }
        return () => null;
    }, [highLoadAverageSuspected])

    //STEP 2 _ 🔴 CONFIRMED HIGH LOAD AVERAGE  + 🔷👀SUSPECT RECOVERY  
    //🔴 HIGH LOAD AVERAGE confirmed
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (!isHighLoadAverageConfirmed) {
                //reset array
                console.log("RESET HIGH LOAD AVERAGE CONFIRMED");
                setHighLoadAverageConfirmed([]);
            } else {
                console.log("IS HIGH LOAD CONFIRMED", isHighLoadAverageConfirmed);
                console.log("📢 NEED TO ALERT START OF INCIDENT, new Alert()")
                // update step
                setCurrentStep(1);
                //copy high load suspected to high load confirmed
                setHighLoadAverageConfirmed([...highLoadAverageSuspected])
                //if (!isHighLoadAverageConfirmed) setHighLoadAverageConfirmed([]) //RESET meaning when it passes to false, no copying suspect etc
            }
        }
        return () => null;
    }, [isHighLoadAverageConfirmed]);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (isHighLoadAverageConfirmed) {
                console.log("🔴 HIGH LOAD CONFIRMED ARRAY", highLoadAverageConfirmed);
                let newTrace = highLoadAverageConfirmed[highLoadAverageConfirmed.length - 1];
                let isALoadAverageDecrease =  newTrace.loadAverageLast1Min < stateConfig.cpuLoadConsiredAsHigh;
                if (isALoadAverageDecrease && !isRecoveryAverageSuspected) {
                    setIsRecoveryAverageSuspected(true);
                }
                // need to maintain the two arrays in case the recovery is not completed
                if (isRecoveryAverageSuspected) {
                    setRecoveryAverageSuspected([...recoveryAverageSuspected, newTrace]);
                }
            }
        }
        return () => null;
    }, [highLoadAverageConfirmed])

    // 🔷👀 RECOVERY SUSPECTED
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (!isRecoveryAverageSuspected) {
                console.log("👎🏻 RECOVERY SUSPECTED ABORTED");
                setRecoveryAverageSuspected([]);
            } else {
                console.log("🔷👀 IS RECOVERY SUSPECTED");
                let newTrace = highLoadAverageConfirmed[highLoadAverageConfirmed.length - 1]; // last trace created
                setRecoveryAverageSuspected([...recoveryAverageSuspected, newTrace])
            }
        }
        return () => null;
    }, [isRecoveryAverageSuspected]);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (isRecoveryAverageSuspected) {
                console.log("🔷👀 RECOVERY SUSPECTED ARR", recoveryAverageSuspected);
                let currentSuspectedWindowAverage = parseFloat(calculateTracesArrayAverage(recoveryAverageSuspected)); // make an average of current window 
                let isRecovering = currentSuspectedWindowAverage < stateConfig.cpuLoadConsiredAsHigh;
                let isWindowMinToConfirmReached = recoveryAverageSuspected.length >= stateConfig.getRecoveryArrayMinLength();
                if (isRecovering) {
                    console.log("isRecovering");
                    if (isWindowMinToConfirmReached) { // confirm the recovery if time min is passed
                        console.log("confirm THE END OF INCIDENT");
                        setIsRecoveryAverageConfirmed(true);
                    }
                } else {
                    // meaning the current window average of sum average recovering is higher than expected and breaks the recovery
                    setIsRecoveryAverageSuspected(false);
                }
            }
        }
        return () => null;
    }, [recoveryAverageSuspected])


    //STEP 3 _ ✅ RECOVERY CONFIRMED _ REPORT END HIGH LOAD AVERAGE
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (!isRecoveryAverageConfirmed) {
                console.log("END OF EVENT ===> RESET EVERYTHING");
                setRecoveryAverageConfirmed([]);
                if (currentStep === 2) setCurrentStep(null); // TODO reset all 
            } else {
                console.log("✅ RECOVERING CONFIRMED => END OF EVENT");
                console.log("📢 NEED TO ALERT END OF INCIDENT, new Alert()"); // maybe later with more context?
                setCurrentStep(2);
                setRecoveryAverageConfirmed([...recoveryAverageSuspected])
            }
        }
        return () => null;
    }, [isRecoveryAverageConfirmed])
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (isRecoveryAverageConfirmed) {
                console.log("UPDATE ARRAY - recoveryAverageConfirmed", recoveryAverageConfirmed);
                let highLoadCleanConfirmedTraces = getHighLoadCleanConfirmedTraces(highLoadAverageConfirmed, recoveryAverageConfirmed);
                console.log("highLoadCleanConfirmedTraces", highLoadCleanConfirmedTraces);
                // let highLoadAverageReport = createReport("highLoad", highLoadCleanConfirmedTraces)
                // let recoveringAverageReport = createReport("recovery",recoveryAverageConfirmed)
                // dispatchData({
                //     type: 'REPORT',
                //     payload: {highLoadAverageReport,recoveringAverageReport}
                // })

                //RESET ALL
            }
        }
        return () => null;
    }, [recoveryAverageConfirmed])

    /********* UTILITIES */
    const controlTrace = (traces, newTrace) => {
        const isHigherThanAverage = newTrace.loadAverageLast1Min > stateConfig.cpuLoadConsiredAsHigh;
        const isCurrentlyAProcess = currentStep !== null;

        if (!isCurrentlyAProcess) {
            if (isHigherThanAverage) {
                //start step 0
                setIsHighLoadAverageSuspected(true);
                setHighLoadAverageSuspected([...highLoadAverageSuspected, newTrace]);
            } else {
                console.log("🏖 Nothing wrong for now")
            }
        } else {
            // Process is already on, we just need to update the array
            steps[currentStep].update([...steps[currentStep].state, newTrace]);
        }
    }
    const manageTracesLRU = (traces, newTrace) => {
        let updatedTraces = [...traces, newTrace];
        let maxLength = stateConfig.getTimeWindowArrayLength();
        if (updatedTraces.length > maxLength) {
            // TODO : if update stateConfig, see to slice if new timeWindowArrayLength is smaller
            updatedTraces.shift();
        }
        return updatedTraces;
    }

    const calculateTracesArrayAverage = (arrOfTraces) => {
        let average = parseFloat(arrOfTraces.reduce((acc, currTrace) => {
            return parseFloat(acc) + parseFloat(currTrace.loadAverageLast1Min)
        }, 0) / arrOfTraces.length);
        return average;
    }

    const getHighLoadCleanConfirmedTraces = (arr1, arr2) => {
        const indexTraceStartPortionToRm = arr1.findIndex(currCon => currCon.dateInMillisecond === arr2[0].dateInMillisecond);
        return arr1.slice(0, indexTraceStartPortionToRm);
    }
    const createReport = (types, traces) => {
        console.log("create report");
        let report = new Report(types, traces);
        console.log(report)
        return report;
    }
 

    return (null);

}

export default DataTreatment;
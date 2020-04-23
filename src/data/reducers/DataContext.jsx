import React, {
    createContext,
    useReducer,
    useContext
} from "react";

import {
    removeTracesFromReportObjToDisplayLRU,
    removeFromTracesArrToDisplayLRU,
    calculateTracesArrayAverage
} from "../../utilities/utilities"

export const DataStateContext = createContext();
export const DataDispatchContext = createContext();

export const initialDataState = {
    // data for main line
    traces: [],
    // temporary high load in progress
    highLoadTempReportToDisplay: null,
    isHighLoadCurrentlyInProgress: false,
    // final reports displayed
    highLoadFinalReportsToDisplay: [],
    recoveryFinalReportsToDisplay: [],

    //Window average
    isLastAverageWindowAnEstimate: true,
    lastWindowAverage: 0,

    //FINAL REPORTS
    eventsFinalReports: [], // event : association {high load , recovery} 
    highLoadFinalReports: [],// recoveringAverageReport:[{}],
    recoveryFinalReports: [],// highLoadAverageReport:[{}],
};


const updateReportsDisplayed = (highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, valueToCompareTo) => {
    let updatedHightLoadFinalReportsDisplayed = removeTracesFromReportObjToDisplayLRU(highLoadFinalReportsToDisplay, "endDateInMs", valueToCompareTo);
    let updatedRecoveryFinalReportsDisplayed = removeTracesFromReportObjToDisplayLRU(recoveryFinalReportsToDisplay, "endDateInMs", valueToCompareTo);
    return {
        updatedHightLoadFinalReportsDisplayed,
        updatedRecoveryFinalReportsDisplayed
    }
}

const estimateLastXMinAverage = (traces, lastTrace) => {

    if(!traces.length) return 0;
        let timeWindowArrayLength = lastTrace?.configUsed?.getTimeWindowArrayLength();
    if (traces.length < timeWindowArrayLength) {
        let estimate = (lastTrace.loadAverageLast5Mins + lastTrace?.loadAverageLast15Mins) / 2;
        estimate = parseFloat(estimate.toPrecision(2));
        return {
            isLastAverageWindowAnEstimate: true,
            lastWindowAverage: estimate
        }
    } else {
        let averageCalculated = calculateTracesArrayAverage(traces);
        return {
            isLastAverageWindowAnEstimate: false,
            lastWindowAverage: averageCalculated
        }
    }
}

export const DataReducer = (state, action) => {
    let lastTrace = state.traces[state.traces.length - 1];
    let olderTraceTimeInMs = state.traces[0]?.dateInMs;
    let lastTraceTimeInMs = lastTrace?.dateInMs;

    switch (action.type) {
        case "UPDATE_TRACES":
            let { updatedHightLoadFinalReportsDisplayed, updatedRecoveryFinalReportsDisplayed } = updateReportsDisplayed(state.highLoadFinalReportsToDisplay, state.recoveryFinalReportsToDisplay, olderTraceTimeInMs);
            let updatedTraces = action.payload;
            let {isLastAverageWindowAnEstimate, lastWindowAverage} =  estimateLastXMinAverage(updatedTraces, lastTrace )
            return {
                ...state,
                traces: [...updatedTraces],
                highLoadFinalReportsToDisplay: updatedHightLoadFinalReportsDisplayed,
                recoveryFinalReportsToDisplay: updatedRecoveryFinalReportsDisplayed,
                isLastAverageWindowAnEstimate,
                lastWindowAverage

            };
        case "CREATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            // console.log("CREATE_REPORT_HIGH_LOAD_IN_PROGRESS", action.payload);
            return {
                ...state,
                highLoadTempReportToDisplay: action.payload,
                isHighLoadCurrentlyInProgress: true
            };
        case "UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            // console.log("UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS", action.payload);
            olderTraceTimeInMs = state.traces[0]?.dateInMs;
            let tempReportTraces = action.payload;
            let updatedTracesDisplay = removeFromTracesArrToDisplayLRU(tempReportTraces, "dateInMs", olderTraceTimeInMs)
            return {
                ...state,
                highLoadTempReportToDisplay: { ...state.highLoadTempReportToDisplay, traces: updatedTracesDisplay, lastUpdateInMs: lastTraceTimeInMs }
            };
        case "UPDATE_FINAL_REPORTS":
            // console.log("UPDATE_FINAL_REPORTS", action.payload);
            return {
                ...state,
                eventsFinalReports: [...state.eventsFinalReports, { ...action.payload }],
                highLoadFinalReports: [...state.highLoadFinalReports, action.payload.highLoadReports],
                recoveryFinalReports: [...state.recoveryFinalReports, action.payload.recoveryReports],
                highLoadFinalReportsToDisplay: [...state.highLoadFinalReportsToDisplay, action.payload.highLoadReports],
                recoveryFinalReportsToDisplay: [...state.recoveryFinalReportsToDisplay, action.payload.recoveryReports],
                highLoadTempReportToDisplay: null,
                isHighLoadCurrentlyInProgress: false
            };
        default:
            return state
    }
};


export const DataProvider = ({ children }) => {
    const [stateData, dispatchData] = useReducer(DataReducer, initialDataState);
    return (
        <DataStateContext.Provider value={{ stateData }}>
            <DataDispatchContext.Provider value={{ dispatchData }}>
                {children}
            </DataDispatchContext.Provider>
        </DataStateContext.Provider>
    );
};

export default DataProvider;
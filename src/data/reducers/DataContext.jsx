import React, {
    createContext,
    useReducer
} from "react";

import { 
    removeTracesFromReportObjToDisplayLRU,
    removeFromTracesArrToDisplayLRU } from "../../utilities/utilities"

export const DataContext = createContext();

export const initialDataState = {
    // data for main line
    traces: [],
    // temporary high load in progress
    highLoadTempReportToDisplay: null,
    // final reports displayed
    highLoadFinalReportsToDisplay: [],
    recoveryFinalReportsToDisplay: [],

    //FINAL REPORTS
    eventsFinalReports: [], // event : association {high load , recovery} 
    highLoadFinalReports: [],// recoveringAverageReport:[{}],
    recoveryFinalReports: [],// highLoadAverageReport:[{}],
};


const updateReportsDisplayed = (highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, valueToCompare) => {
    let updatedHightLoadFinalReportsDisplayed = removeTracesFromReportObjToDisplayLRU(highLoadFinalReportsToDisplay, "endDateInMs", valueToCompare);
    let updatedRecoveryFinalReportsDisplayed = removeTracesFromReportObjToDisplayLRU(recoveryFinalReportsToDisplay, "endDateInMs", valueToCompare);
    return {
        updatedHightLoadFinalReportsDisplayed,
        updatedRecoveryFinalReportsDisplayed
    }
}

export const dataReducer = (state, action) => {
    let olderTraceTimeInMs = state.traces[0]?.dateInMs;
    let lastTraceTimeInMs = state.traces[state.traces.length -1]?.dateInMs;

    switch (action.type) {
        case "UPDATE_TRACES":
            let { updatedHightLoadFinalReportsDisplayed, updatedRecoveryFinalReportsDisplayed } = updateReportsDisplayed(state.highLoadFinalReportsToDisplay, state.recoveryFinalReportsToDisplay, olderTraceTimeInMs);
            return {
                ...state,
                traces: [...action.payload],
                highLoadFinalReportsToDisplay: updatedHightLoadFinalReportsDisplayed,
                recoveryFinalReportsToDisplay: updatedRecoveryFinalReportsDisplayed

            };
        case "CREATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            console.log("CREATE_REPORT_HIGH_LOAD_IN_PROGRESS", action.payload);
            return {
                ...state,
                highLoadTempReportToDisplay: action.payload
            };
        case "UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            console.log("UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS", action.payload);
            olderTraceTimeInMs = state.traces[0]?.dateInMs;
            let tempReportTraces = action.payload;
            let updatedTracesDisplay = removeFromTracesArrToDisplayLRU(tempReportTraces,"dateInMs", olderTraceTimeInMs)
            return {
                ...state,
                highLoadTempReportToDisplay: { ...state.highLoadTempReportToDisplay, traces: updatedTracesDisplay, lastUpdateInMs: lastTraceTimeInMs}
            };
        case "UPDATE_FINAL_REPORTS":
            console.log("UPDATE_FINAL_REPORTS", action.payload);
            return {
                ...state,
                eventsFinalReports: [...state.eventsFinalReports, { ...action.payload }],
                highLoadFinalReports: [...state.highLoadFinalReports, action.payload.highLoadReports],
                recoveryFinalReports: [...state.recoveryFinalReports, action.payload.recoveryReports],
                highLoadFinalReportsToDisplay: [...state.highLoadFinalReportsToDisplay, action.payload.highLoadReports],
                recoveryFinalReportsToDisplay: [...state.recoveryFinalReportsToDisplay, action.payload.recoveryReports],
                highLoadTempReportToDisplay: null
            };
        default:
            return state
    }
};


export const DataProvider = (props) => {
    const [stateData, dispatchData] = useReducer(dataReducer, initialDataState);
    return (
        <DataContext.Provider
            value={{ dispatchData, stateData }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataProvider;
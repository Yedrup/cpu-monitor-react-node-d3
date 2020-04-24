import React, {
    createContext,
    useReducer
} from "react";

import {
    removeFromTracesArrToDisplayLRU,
    eventsHistoricLRU,
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
};


const updateReportsDisplayed = (highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, valueToCompareTo) => {
    // update the reports to be displayed in the time window of the chart 
    let updatedHightLoadFinalReportsDisplayed = removeFromTracesArrToDisplayLRU(highLoadFinalReportsToDisplay, "endDateInMs", valueToCompareTo);
    let updatedRecoveryFinalReportsDisplayed = removeFromTracesArrToDisplayLRU(recoveryFinalReportsToDisplay, "endDateInMs", valueToCompareTo);
    return {
        updatedHightLoadFinalReportsDisplayed,
        updatedRecoveryFinalReportsDisplayed
    }
}

const updateEventsHistoric = (eventsFinalReports, lastTrace) => {
    //we use lastTrace to access to the current config and timeHistoryWindowInMs (useContext not possible to use)
    let currentHistoricTimeWindowInMs = lastTrace.configUsed.timeHistoryWindowInMs;
    let updated = eventsHistoricLRU(eventsFinalReports, "endDateInMs", currentHistoricTimeWindowInMs);
    return updated;
}

const estimateLastXMinutesAverage = (traces, lastTrace) => {
    let timeWindowArrayLength = lastTrace?.configUsed?.getTimeWindowArrayLength() || 2;
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
    let lastTrace = state.traces.length ? state.traces[state.traces.length - 1] : action.payload[0];
    let olderTraceTimeInMs = state.traces[0]?.dateInMs;
    let lastTraceTimeInMs = lastTrace?.dateInMs;

    switch (action.type) {
        case "UPDATE_TRACES":
            //LRU being already done using config context with time Window max length in datatreatment, we know that the oldest trace is the limit
            let {
                updatedHightLoadFinalReportsDisplayed,
                updatedRecoveryFinalReportsDisplayed
            } = updateReportsDisplayed(state.highLoadFinalReportsToDisplay, state.recoveryFinalReportsToDisplay, olderTraceTimeInMs);
            let updatedTraces = action.payload;
            let updatedLastTrace = updatedTraces[updatedTraces.length - 1];
            let { isLastAverageWindowAnEstimate, lastWindowAverage } = estimateLastXMinutesAverage(updatedTraces, updatedLastTrace);

            let updatedHistoric = updateEventsHistoric(state.eventsFinalReports, updatedLastTrace);

            return {
                ...state,
                traces: [...updatedTraces],
                highLoadFinalReportsToDisplay: updatedHightLoadFinalReportsDisplayed,
                recoveryFinalReportsToDisplay: updatedRecoveryFinalReportsDisplayed,
                eventsFinalReports: [...updatedHistoric],
                isLastAverageWindowAnEstimate,
                lastWindowAverage

            };
        case "CREATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            return {
                ...state,
                highLoadTempReportToDisplay: action.payload,
                isHighLoadCurrentlyInProgress: true
            };
        case "UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS":
            olderTraceTimeInMs = state.traces[0]?.dateInMs;
            let tempReportTraces = action.payload;
            let updatedTracesDisplay = removeFromTracesArrToDisplayLRU(tempReportTraces, "dateInMs", olderTraceTimeInMs)
            return {
                ...state,
                highLoadTempReportToDisplay: { ...state.highLoadTempReportToDisplay, traces: updatedTracesDisplay, lastUpdateInMs: lastTraceTimeInMs }
            };
        case "UPDATE_FINAL_REPORTS":
            return {
                ...state,
                eventsFinalReports: [...state.eventsFinalReports, { ...action.payload }],
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
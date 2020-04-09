import React, {
    createContext,
    useReducer
} from "react";

export const DataContext = createContext();

export const initialDataState = {
    traces: [],
    highLoadConfirmed: [],
    recoveredFromHighLoadConfirmed: [],
    eventsReports: [],
    /*[{
        highLoadAverageReport:{},
        recoveringAverageReport:{}
        }]*/
    highLoadReports: [],// recoveringAverageReport:{},
    recoveryReports: [],// highLoadAverageReport:{},
    isCpusCurrentlyUnderHighLoadAverage: false,
    isCpusCurrentlyRecovering: false
};

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'test_update':
            console.log("test_update");
            return {
                ...state,
                traces: [...state.traces, action.payload]
            };
        case "UPDATE_TRACES":
            // usage for chart display line 
            // console.log("UPDATE_TRACES action.payload",action.payload);
            return {
                ...state,
                traces: [...action.payload]
            };
        case "CONFIRMED_HIGH_LOAD_AVERAGE":
            // console.log("CONFIRMED_HIGH_LOAD_AVERAGE",action.payload);
            return {
                ...state,
                highLoadConfirmed: [...action.payload],
                isCpusCurrentlyUnderHighLoadAverage: true
            };
        case "CONFIRMED_RECOVERED":
            console.log("CONFIRMED_RECOVERED", action.payload);
            return {
                ...state,
                recoveredFromHighLoadConfirmed: [...action.payload],
                isCpusCurrentlyUnderHighLoadAverage: true
            };
        case "UPDATE_REPORT":
            console.log("UPDATE_REPORT", action.payload);
            return {
                ...state,
                eventsReports: [{ ...action.payload }],
                highLoadReports: [...state.highLoadReports, action.payload.highLoadAverageNewReport],// recoveringAverageReport:{},
                recoveryReports: [...state.highLoadReports, action.payload.recoveringAverageNewReport]
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
import React, {
    createContext,
    useReducer
} from "react";

export const DataContext = createContext();

export const initialDataState = {
    traces: [],
    highLoadConfirmed: [],
    recoveredFromHighLoadConfirmed: [],
    reports: []
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
            // create Trace
            console.log("UPDATE_TRACES action.payload",action.payload);
            return {
                ...state,
                traces: [...action.payload]
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
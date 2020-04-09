import React, {
  createContext,
  useEffect,
  useReducer,
  useContext
} from "react";
import {
  getLengthOfArrForATimeWindow
} from "../../utilities/utilities";
import { RequestStatusContext } from '../context/RequestStatusContext';


export const ConfigContext = createContext();


export const initialConfigState = {
  loadAverageByCpuConsiredAsHigh : .5,
  durationMinCpuHighLoadInMs : 30000, /*1min*/
  durationMinRecoveryInMs : 30000, /*1min*/
  intervalInMs : 10000, /*10sec*/
  windowInMs : 180000,
  getTimeWindowArrayLength : function() {
    return getLengthOfArrForATimeWindow(this.windowInMs, this.intervalInMs);
  },
  getHighLoadAverageMinArrayLength : function() {
    return getLengthOfArrForATimeWindow(this.durationMinCpuHighLoadInMs, this.intervalInMs) 
  },
  getRecoveryArrayMinLength : function() {
    return getLengthOfArrForATimeWindow(this.durationMinRecoveryInMs, this.intervalInMs);
  }
};

export const configReducer = (state, action) => {
  switch (action.type) {
      case 'UPDATE_INTERVAL':
          console.log("UPDATE_INTERVAL");
          return {
              ...state,
              intervalInMs: action.payload
          };
      default:
          return state
  }
};


export const ConfigProvider = (props) => {
  const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
  const [stateConfig, dispatchConfig] = useReducer(configReducer, initialConfigState);

  useEffect(() => {
    console.log("CONFIG HAS CHANGED ==>", stateConfig);
    const interval = setInterval(() => {
      setIsRequesting(true);
    }, stateConfig.intervalInMs);
    return () => clearInterval(interval);
  }, [stateConfig]);

  return (
    <ConfigContext.Provider
      value={{ dispatchConfig, stateConfig}}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
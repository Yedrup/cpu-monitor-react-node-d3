import React, {
  createContext,
  useEffect,
  useReducer,
  useContext
} from "react";
import {
  getLengthOfArrForATimeWindow,
  convertMsInMin, 
  convertMsInSec
} from "../../utilities/utilities";
import { RequestStatusContext } from '../context/RequestStatusContext';


export const ConfigContext = createContext();


export const initialConfigState = {
  loadAverageByCpuConsiredAsHigh : .6,
  minimumDurationCpuHighLoadInMs : 30000, /*1min*/
  minimumDurationRecoveryInMs : 30000, /*1min*/
  intervalInMs : 10000, /*10sec*/
  timeWindowInMs : 180000,
  timeHistoryWindowInMs: 280000,
  getTimeWindowArrayLength : function() {
    return getLengthOfArrForATimeWindow(this.timeWindowInMs, this.intervalInMs);
  },
  getHighLoadAverageMinArrayLength : function() {
    return getLengthOfArrForATimeWindow(this.minimumDurationCpuHighLoadInMs, this.intervalInMs) 
  },
  getRecoveryArrayMinLength : function() {
    return getLengthOfArrForATimeWindow(this.minimumDurationRecoveryInMs, this.intervalInMs);
  },
  getTimeIntervalInSec : function() {
    return convertMsInSec(this.intervalInMs);
  },
  getTimeWindowInMin : function() {
    return convertMsInMin(this.timeWindowInMs);
  },
  getTimeHistoryWindowInMin : function() {
    return convertMsInMin(this.timeHistoryWindowInMs);
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


export const ConfigProvider = ({children}) => {
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
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
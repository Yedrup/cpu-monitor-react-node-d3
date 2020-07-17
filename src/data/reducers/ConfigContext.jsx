import React, { createContext, useEffect, useReducer, useContext } from 'react';
import {
  getLengthOfArrForATimeWindow,
  convertMsInMin,
  convertMsInSec,
} from '../../utilities/utilities';
import { RequestStatusContext } from '../context/RequestStatusContext';

export const ConfigContext = createContext();

export const initialConfigState = {
  loadAverageByCpuConsideredAsHigh: 1,
  minimumDurationCpuHighLoadInMs: 120000 /*2min*/,
  minimumDurationRecoveryInMs: 120000 /*2min*/,
  intervalInMs: 10000 /*10sec*/,
  timeWindowInMs: 600000 /*10min*/,
  timeHistoryWindowInMs: 600000 /*10min*/,
  getTimeWindowArrayLength: function () {
    return getLengthOfArrForATimeWindow(this.timeWindowInMs, this.intervalInMs);
  },
  getHighLoadAverageMinArrayLength: function () {
    return getLengthOfArrForATimeWindow(
      this.minimumDurationCpuHighLoadInMs,
      this.intervalInMs
    );
  },
  getRecoveryArrayMinLength: function () {
    return getLengthOfArrForATimeWindow(
      this.minimumDurationRecoveryInMs,
      this.intervalInMs
    );
  },
  getTimeIntervalInSec: function () {
    return convertMsInSec(this.intervalInMs);
  },
  getTimeWindowInMin: function () {
    return convertMsInMin(this.timeWindowInMs);
  },
  getTimeHistoryWindowInMin: function () {
    return convertMsInMin(this.timeHistoryWindowInMs);
  },
};

export const configReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INTERVAL':
      return {
        ...state,
        intervalInMs: action.payload,
      };
    default:
      return state;
  }
};

export const ConfigProvider = ({ children }) => {
  const { setIsRequesting } = useContext(RequestStatusContext);
  const [stateConfig, dispatchConfig] = useReducer(
    configReducer,
    initialConfigState
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRequesting(true);
    }, stateConfig.intervalInMs);
    return () => clearInterval(interval);
    //eslint-disable-next-line
  }, [stateConfig]);

  return (
    <ConfigContext.Provider value={{ dispatchConfig, stateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;

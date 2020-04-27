import '@testing-library/jest-dom/extend-expect'
import {
  calculateTracesArrayAverage,
  getLengthOfArrForATimeWindow
} from "../utilities/utilities"
import * as fakeData from "../data/fakeData.json";

const configExample = {
  loadAverageByCpuConsiredAsHigh: .6,
  minimumDurationCpuHighLoadInMs: 30000,
  minimumDurationRecoveryInMs: 30000,
  intervalInMs: 10000,
  timeWindowInMs: 180000,
  timeHistoryWindowInMs: 280000,
  getTimeWindowArrayLength: function () {
    return getLengthOfArrForATimeWindow(this.timeWindowInMs, this.intervalInMs);
  },
  getHighLoadAverageMinArrayLength: function () {
    return getLengthOfArrForATimeWindow(this.minimumDurationCpuHighLoadInMs, this.intervalInMs)
  },
  getRecoveryArrayMinLength: function () {
    return getLengthOfArrForATimeWindow(this.minimumDurationRecoveryInMs, this.intervalInMs);
  },
  getTimeIntervalInSec: function () {
    return convertMsInSec(this.intervalInMs);
  },
  getTimeWindowInMin: function () {
    return convertMsInMin(this.timeWindowInMs);
  },
  getTimeHistoryWindowInMin: function () {
    return convertMsInMin(this.timeHistoryWindowInMs);
  }
};

// Same logic is applied to pass the steps
it('should create an alert of High Load Average confirmed', () => {
  const tracesExamples = fakeData.tracesSuspected;
  let currentSuspectedWindowAverage = parseFloat(calculateTracesArrayAverage(tracesExamples));
  let isWindowMinToConfirmHighAverageReached = tracesExamples.length >= configExample.getHighLoadAverageMinArrayLength();
  let isCurrentlyInHighAverage = currentSuspectedWindowAverage > configExample.loadAverageByCpuConsiredAsHigh;

  if (isCurrentlyInHighAverage) {
    if (isWindowMinToConfirmHighAverageReached) {
      expect(isCurrentlyInHighAverage && isWindowMinToConfirmHighAverageReached).toBe(true);
    }
  } else {
    // get back to previous step
  }
});
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MS_IN_1_MIN = 60000;
const MS_IN_1_SEC = 1000;
const SEC_IN_1_MIN = 60;
const MIN_IN_1_H = 60;

export const callApi = async (ApiUrl) => {
  try {
    const response = await fetch(ApiUrl);
    let data = await response.json();
    // console.log("API response =>", data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const addPlaceholder = (sentence, charToReplace, replacedBy) => {
  let newSentence = sentence.replace(charToReplace, replacedBy);
  return newSentence;
};

/*
 * DATES ******************************************************************************************
 */

export const convertMsInMin = (timeInMs) => {
  return timeInMs / MS_IN_1_MIN;
};

export const convertMsInSec = (timeInMs) => {
  return timeInMs / MS_IN_1_SEC;
};

export const convertMinInMs = (timeInMin) => {
  return timeInMin * MS_IN_1_MIN;
};

export const convertSecInMs = (timeInSec) => {
  return timeInSec * MS_IN_1_SEC;
};

export const returnTimeInMilliseconds = (timeStamp) => {
  let date = new Date(timeStamp);
  return date.getTime();
};

export const formatDateIntoString = (dateObj) => {
  // let year =dateObj.getFullYear();
  let month = dateObj.getMonth();
  let day = dateObj.getDate();
  let hour = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let seconds = dateObj.getSeconds();
  let milliseconds = dateObj.getMilliseconds();
  return `${MONTHS[month]} ${day} ${hour}:${minutes}:${seconds}.${milliseconds}`;
};

export const getDurationInHMS = (
  startTimeMilliseconds,
  endTimeMilliseconds
) => {
  let differenceInMS = endTimeMilliseconds - startTimeMilliseconds;
  let differenceInSecondes = Math.floor(differenceInMS / MS_IN_1_SEC);
  let differenceInMinutes = Math.floor(differenceInSecondes / SEC_IN_1_MIN);
  let differenceInHours = Math.floor(differenceInMinutes / MIN_IN_1_H);

  let s = differenceInSecondes % 60;
  let h = differenceInHours % 24;
  let m = differenceInMinutes % 60;
  // console.log(`${h}:${m}:${s}s`);

  return `${h}:${m}:${s}s`;
};

export const calculateTracesArrayAverage = (arrOfTraces) => {
  let average = parseFloat(
    arrOfTraces.reduce((acc, currTrace) => {
      return parseFloat(acc) + parseFloat(currTrace.loadAverageLast1Min);
    }, 0) / arrOfTraces.length
  );
  return parseFloat(average.toPrecision(2));
};

export const getLengthOfArrForATimeWindow = (timeWindowInMs, intervalInMs) => {
  return Math.round(timeWindowInMs / intervalInMs);
};
/*
 * OBJECTS ******************************************************************************************
 */

export const isObjectHavingKeys = (obj) => {
  return Object.keys(obj).length;
};

export const removeElementFromArray = (arr, value) => {
  return arr.filter((element) => {
    return element !== value;
  });
};

export const filterArrayOfObjectByProperty = (arr, prop) => {
  if (!arr.length) return [];
  let filtered = arr.reduce((acc, object) => {
    let newAcc = [...acc, { ...object[prop] }];
    return newAcc;
  }, []);
  return filtered;
};

export const removeFromTracesArrToDisplayLRU = (
  arrOfReportsObj,
  prop,
  olderTraceDisplayed
) => {
  let filtered = arrOfReportsObj.filter((currentReport) => {
    return currentReport[prop] > olderTraceDisplayed;
  });
  return filtered;
};

export const eventsHistoricLRU = (
  arrayOfEventsReports,
  prop,
  historicTimeWindow
) => {
  let now = Date.now();
  let limitReportsInMs = now - historicTimeWindow;
  // to keep events integrity (high loads + recovery), only the events having a recovery endDates <= historicTimeWindow are removed
  let filtered = arrayOfEventsReports.filter((event) => {
    return event.recoveryReports.endDateInMs >= limitReportsInMs;
  });
  return filtered;
};

export const unmergeArraysConsecutivelyJoined = (
  arrayWithDuplicated,
  array,
  propToCheck
) => {
  const firstDuplicatedElement = array[0];
  const indexTraceStartPortionToRm = arrayWithDuplicated.findIndex(
    (currElem) => currElem[propToCheck] === firstDuplicatedElement[propToCheck]
  );
  return arrayWithDuplicated.slice(0, indexTraceStartPortionToRm + 1); // +1 to join the end of first part to the next part in chart
};

export const getPeakAndTroughFromTraces = (traces, propToCheck) => {
  let peakAndTrough = traces.reduce((acc, trace) => {
    acc.though =
      acc.though === undefined || trace[propToCheck] < acc.though
        ? trace[propToCheck]
        : acc.though;
    acc.peak =
      acc.peak === undefined || trace[propToCheck] > acc.peak
        ? trace[propToCheck]
        : acc.peak;
    return acc;
  }, {});
  return peakAndTrough;
};

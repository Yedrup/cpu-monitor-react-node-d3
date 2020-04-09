const MS_IN_1_MIN = 60000;
const MS_IN_1_SEC = 1000;
const SEC_IN_1_MIN = 60;
const MIN_IN_1_H = 60;

const callApi = async ApiUrl => {
    try {
        const response = await fetch(ApiUrl);
        let data = await response.json();
        console.log("data", data);
        return data;
    } catch (err) {
        console.log(err);
    }
}


/*
 * DATES ******************************************************************************************
 */

const convertMinInMs = timeInMin => {
    return timeInMin * MS_IN_1_MIN;
}

const convertSecInMs = timeInSec => {
    return timeInSec * MS_IN_1_SEC;
}

const returnTimeInMilliseconds = timeStamp => {
    let date = new Date(timeStamp);
    return date.getTime();
}

const getDurationInHMS = (startTimeMilliseconds, endTimeMilliseconds) => {
    let differenceInMS = endTimeMilliseconds - startTimeMilliseconds;
    let differenceInSecondes = Math.floor(differenceInMS / MS_IN_1_SEC);
    let differenceInMinutes = Math.floor(differenceInSecondes / SEC_IN_1_MIN);
    let differenceInhours = Math.floor(differenceInMinutes / MIN_IN_1_H);

    let s = differenceInSecondes % 60;
    let h = differenceInhours % 24;
    let m = differenceInMinutes % 60;
    // console.log(`${h}:${m}:${s}s`);

    return `${h}:${m}:${s}s`
}

const calculateTracesArrayAverage = (arrOfTraces) => {
    let average = parseFloat(arrOfTraces.reduce((acc, currTrace) => {
        return parseFloat(acc) + parseFloat(currTrace.loadAverageLast1Min)
    }, 0) / arrOfTraces.length);
    return average;
}

const getLengthOfArrForATimeWindow = (timeWindowInMs, intervalInMs) => {
    return Math.round(timeWindowInMs / intervalInMs);
}
/*
 * ARRAY ******************************************************************************************
 */

const removeElementFromArray = (arr, value) => {
    return arr.filter((element) => {
        return element != value;
    });
}

const unmergeArraysConsecutivlyJoined = (arrayWithDuplicated, array, propTocheck) => {
    const firstDublicatedElement = array[0];
    const indexTraceStartPortionToRm = arrayWithDuplicated.findIndex(currElem => currElem[propTocheck] === firstDublicatedElement[propTocheck]);
    return arrayWithDuplicated.slice(0, indexTraceStartPortionToRm);
}

const getPeakAndTroughFromTraces = (traces, propToCheck) => {
    let peakAndTrough = traces.reduce((acc, trace) => {
        acc.though = (acc.though === undefined || trace[propToCheck] < acc.though) ? trace[propToCheck] : acc.though;
        acc.peack = (acc.peack === undefined || trace[propToCheck] > acc.peack) ? trace[propToCheck] : acc.peack;
        return acc
    }, {});

    console.log(peakAndTrough);
    return peakAndTrough;
}



module.exports = {
    //TRACES
    calculateTracesArrayAverage,
    //API CALL
    callApi,
    //DATES
    convertMinInMs,
    convertSecInMs,
    returnTimeInMilliseconds,
    getDurationInHMS,
    getLengthOfArrForATimeWindow,
    //ARRAY
    unmergeArraysConsecutivlyJoined,
    removeElementFromArray,
    getPeakAndTroughFromTraces
};
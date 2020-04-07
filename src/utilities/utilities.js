const MIN_IN_MS = 60000;
const SEC_IN_MS = 1000;


const callApi = async ApiUrl => {
    const response = await fetch(ApiUrl);
    let data = await response.json();
    console.log("data", data);
    return data;
  }


/*
 * DATES ******************************************************************************************
 */

const convertMinInMs = timeInMin => {
    return  timeInMin * MIN_IN_MS;
}

const convertSecInMs = timeInSec => {
    return  timeInSec * SEC_IN_MS;
}

const returnTimeInMilliseconds = timeStamp => {
    let date = new Date(timeStamp);
    return date.getTime();
}

const getDurationInHMS = (startTimeMilliseconds, endTimeMilliseconds) => {
    let difference = endTimeMilliseconds - startTimeMilliseconds;
    let differenceInSecondes = Math.floor(difference / 1000);
    let differenceInMinutes = Math.floor(differenceInSecondes / 60);
    let differenceInhours = Math.floor(differenceInMinutes / 60);

    let s = differenceInSecondes % 60;
    let h = differenceInhours % 24;
    let m = differenceInMinutes % 60;

    console.log(differenceInhours, differenceInMinutes, differenceInSecondes);
    console.log(`${h}:${m}:${s}s`);

    return `${h}:${m}:${s}s`
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





/*
 * EXPORTS ******************************************************************************************
 */


module.exports = {
    callApi,
    //DATES
    convertMinInMs,
    convertSecInMs,
    returnTimeInMilliseconds,
    getDurationInHMS,
    getLengthOfArrForATimeWindow,
    //ARRAY
    removeElementFromArray
};
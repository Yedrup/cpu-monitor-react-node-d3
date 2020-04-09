/************CLASS REPORT ***************************************************************************************************/
import {getDurationInHMS} from "../utilities/utilities"

export default class Report {
    constructor(type, traces) {
        this.type = type;//recovering or high load
        //max load? 
        this.completeAverage = "" ;// reduce //length 
        this.startDateInMilliseconds = ""/*traces[traces.length-1]*/;
        this.startDateString = new Date(this.startDateInMilliseconds);// traces[0]
        this.endDateInMilliseconds = ""/*trace[0].dateInMs*/; 
        this.endDateString = new Date(/*this.endDateInMilliseconds*/);
        this.duration = getDurationInHMS(this.startDateInMilliseconds, this.endDateInMilliseconds);
        this.traces = traces;
    }
}
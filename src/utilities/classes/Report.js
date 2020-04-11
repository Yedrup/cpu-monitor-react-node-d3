import {getDurationInHMS, calculateTracesArrayAverage,getPeakAndTroughFromTraces} from "../utilities"

export default class Report {
    constructor(type, traces) {
        let average = calculateTracesArrayAverage(traces);
        let {though, peack} =  getPeakAndTroughFromTraces(traces, "loadAverageLast1Min");
        let endInMs = traces[traces.length-1].dateInMs;
        let startInMs  = traces[0].dateInMs;
        this.type = type;
        this.completeAverage = average;
        this.peack = peack;
        this.though = though;
        this.startdateInMs = startInMs;
        this.startDateString = new Date(this.startdateInMs);
        this.endateInMs = endInMs;
        this.endDateString = new Date(this.endateInMs);
        this.duration = getDurationInHMS(this.startdateInMs, this.endateInMs);
        this.traces = traces;
    }
}
import {
    getDurationInHMS,
    calculateTracesArrayAverage,
    getPeakAndTroughFromTraces
} from "../utilities"

export class Report {
    constructor(type,traces) {
        let startInMs = traces[0].dateInMs;
        let startDateString = new Date(startInMs);
        this.traces = traces;
        this.type = type;
        this.startDateInMs = startInMs;
        this.startDateString = startDateString;
    }
}

export class ReportInProgress extends Report {
    constructor(type, traces) {
        let lastUpdateInMs = traces[traces.length - 1].dateInMs;
        super(type, traces)
        this.isReportFinished = false;
        this.lastUpdateInMs = lastUpdateInMs;
    }
}


export  class ReportFinished extends Report {
    constructor(type, traces) {
        super(type, traces);
        let average = calculateTracesArrayAverage(traces);
        let { though,peack} = getPeakAndTroughFromTraces(traces, "loadAverageLast1Min");
        let endInMs = traces[traces.length - 1].dateInMs;
        let endDateString = new Date(endInMs);
        let duration = getDurationInHMS(this.startDateInMs, endInMs);

        this.isReportFinished = true;
        this.endDateInMs = endInMs;
        this.endDateString = endDateString;
        this.peack = peack;
        this.though = though;
        this.completeAverage = average;
        this.duration = duration;
    }
}
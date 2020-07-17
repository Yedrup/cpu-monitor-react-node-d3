import {
  getDurationInHMS,
  calculateTracesArrayAverage,
  getPeakAndTroughFromTraces,
  formatDateIntoString,
} from '../utilities';

export class Report {
  constructor(type, traces) {
    let startInMs = traces[0].dateInMs;
    let startDateObj = new Date(startInMs);
    let startDateString = formatDateIntoString(startDateObj);
    this.traces = traces;
    this.type = type;
    this.startDateInMs = startInMs;
    this.startDateString = startDateString;
    this.startDateObj = startDateObj;
  }
}

export class ReportInProgress extends Report {
  constructor(type, traces) {
    let lastUpdateInMs = traces[traces.length - 1].dateInMs;
    super(type, traces);
    this.isReportFinished = false;
    this.lastUpdateInMs = lastUpdateInMs;
  }
}

export class ReportFinished extends Report {
  constructor(type, traces) {
    super(type, traces);
    let average = calculateTracesArrayAverage(traces);
    let { though, peak } = getPeakAndTroughFromTraces(
      traces,
      'loadAverageLast1Min'
    );
    let endInMs = traces[traces.length - 1].dateInMs;
    let endDateObj = new Date(endInMs);
    let endDateString = formatDateIntoString(endDateObj);
    let duration = getDurationInHMS(this.startDateInMs, endInMs);

    this.isReportFinished = true;
    this.endDateInMs = endInMs;
    this.endDateString = endDateString;
    this.endDateObj = endDateObj;
    this.peak = peak;
    this.though = though;
    this.completeAverage = average;
    this.duration = duration;
  }
}

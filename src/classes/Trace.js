class Trace {
  constructor(cpuData) {
    let date = new Date(cpuData.timeStampInMs);
    this.loadAverageLast1Min = cpuData.loadAverageLast1Min;
    this.date = date;
    this.dateInMillisecond = cpuData.timeStampInMs;
    this.loadAverageLast5Mins = cpuData.loadAverageLast5Mins;
    this.loadAverageLast15Mins = cpuData.loadAverageLast15Mins;
  }
}
export default Trace;
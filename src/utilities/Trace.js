class Trace {
  constructor(cpuData, configUsed) {
    let date = new Date(cpuData.timeStampInMs);
    this.loadAverageLast1Min = cpuData.loadAverageLast1Min;
    this.date = date;
    this.configUsed = configUsed;
    this.dateInMs = cpuData.timeStampInMs;
    this.loadAverageLast5Mins = cpuData.loadAverageLast5Mins;
    this.loadAverageLast15Mins = cpuData.loadAverageLast15Mins;
  }
}
export default Trace;
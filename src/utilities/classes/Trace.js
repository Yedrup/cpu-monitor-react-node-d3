import { formatDateIntoString } from '../utilities';

class Trace {
  constructor(cpuData, configUsed) {
    let dateObj = new Date(cpuData.timeStampInMs);
    let dateString = formatDateIntoString(dateObj);
    this.loadAverageLast1Min = cpuData.loadAverageLast1Min;
    this.dateString = dateString;
    this.dateObj = dateObj;
    this.configUsed = configUsed;
    this.dateInMs = cpuData.timeStampInMs;
    this.loadAverageLast5Mins = cpuData.loadAverageLast5Mins;
    this.loadAverageLast15Mins = cpuData.loadAverageLast15Mins;
  }
}
export default Trace;

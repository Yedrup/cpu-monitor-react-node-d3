const recovery = {
  message: 'Recovery',
  severity: 'success',
};

const highLoad = {
  message: 'High load',
  severity: 'error',
};

const getCustomizedNotification = (type) =>
  type === 'recoveryConfirmed' ? recovery : highLoad;

export default class Notification {
  constructor(type, trace, duration = 6000) {
    this.display = getCustomizedNotification(type);
    this.type = type;
    this.trace = trace;
    this.duration = duration;
  }
}

const recovery = {
    message : "recovery",
    color : "success"
}

const highLoad = {
    message : "high load",
    color : "error"
}

const getCustomizedNotification = (type) => type === "recoveryConfirmed" ? recovery :highLoad;


export default class Notification {
    constructor(type, trace, duration = 6000) {
        this.display = getCustomizedNotification(type);
        this.type = type;
        this.trace = trace;
        this.duration = duration;
    }
}
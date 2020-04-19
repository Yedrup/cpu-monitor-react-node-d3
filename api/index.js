const os = require('os');
const express = require("express");
const bodyParser = require("body-parser");
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);


const PORT = 3001;
const AVERAGE_PRECISION = 2;
const CPUS_COUNT = os.cpus().length;
const CPUS_LIST = os.cpus();

const getLoadAverageByCpu = loadAverageArr => {
   return loadAverageArr.map(loadAv => parseFloat((loadAv / CPUS_COUNT).toPrecision(AVERAGE_PRECISION)));
}


app.get('/api/cpu/info', (req, res) => {
    res.send({
        cpusCount: CPUS_COUNT,
        cpusList: CPUS_LIST,
    })
});

app.get('/api/cpu/averages', (req, res) => {
    const LOAD_AVERAGE_LAST_1_5_15_MINS = os.loadavg();
    let now = Date.now();
    console.log("LOAD_AVERAGE_LAST_1_5_15_MINS",LOAD_AVERAGE_LAST_1_5_15_MINS);
    let loadAverageByCpu_1_5_10 = getLoadAverageByCpu(LOAD_AVERAGE_LAST_1_5_15_MINS);
    console.log("loadAverageByCpu_1_5_10", loadAverageByCpu_1_5_10);
    res.send({
        timeStampInMs: now,
        loadAverageLast1Min: loadAverageByCpu_1_5_10[0],
        loadAverageLast5Mins: loadAverageByCpu_1_5_10[1],
        loadAverageLast15Mins: loadAverageByCpu_1_5_10[2],
    })
});


app.listen(PORT, function () {
    console.log("Runnning on " + PORT);
});

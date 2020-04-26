import * as LABELS from "../../../data/labels.json"

export const getTplTracePoint = (trace) => {
    const { dateString, loadAverageLast1Min } = trace;
    return (`
        <p>🕒 ${LABELS.chart.tooltip.common.time}: ${dateString}</p >
        <p>🏷 ${LABELS.chart.tooltip.common.average.specificTime}: ${loadAverageLast1Min}</p>
    `)
}

export const getTplTemporaryReport = (report) => {
    return (`
        <h1>${LABELS.chart.tooltip[report.type].title}</h1>
        <p>🕙${LABELS.chart.tooltip.common.eventInfo.started}: ${report.startDateString} </p>
        <p>${LABELS.chart.tooltip.common.status.inProgress}</p>
    `)
}
export const getTplFinalReport = (report) => {
    const { duration, completeAverage, startDateString, endDateString } = report;
    return (`
<h1>${LABELS.chart.tooltip[report.type].title}</h1>
        <p>🕙 ${LABELS.chart.tooltip.common.eventInfo.started}: ${startDateString} </p >
        <p>🕥 ${LABELS.chart.tooltip.common.eventInfo.finished}: ${endDateString} </p >
        <p>⏱ ${LABELS.chart.tooltip.common.duration}: ${duration}</p>
        <p>🏷 ${LABELS.chart.tooltip.common.average.onPeriod}: ${completeAverage}</p>
        <p>${LABELS.chart.tooltip.common.status.finished}</p>
    `)
} 
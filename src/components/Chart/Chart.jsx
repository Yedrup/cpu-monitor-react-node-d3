import React, {
    useContext,
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useMemo
} from 'react'

import {
    select,
    selectAll,
    event,
    line,
    max,
    scaleLinear,
    scaleTime,
    extent,
    axisRight,
    axisBottom,
} from "d3";

import { Box } from "@material-ui/core";
import { ConfigContext } from '../../data/reducers/ConfigContext';
import { DataStateContext } from '../../data/reducers/DataContext';

import Legend from "./utilities/legend";
import { addPlaceholder } from "../../utilities/utilities"

import * as LABELS from "../../data/labels.json"

import './Chart.css';

function Chart(props) {

    const { stateConfig } = useContext(ConfigContext);
    const {
        stateData: {
            traces,
            recoveryFinalReportsToDisplay,
            highLoadFinalReportsToDisplay,
            highLoadTempReportToDisplay
        }
    } = useContext(DataStateContext);

    const {
        loadAverageByCpuConsiredAsHigh,
        intervalInMs
    } = stateConfig

    let timeWindowInMin = stateConfig.getTimeWindowInMin();
    let intervalInSecond = stateConfig.getTimeIntervalInSec();
    const svgElementRef = useRef(null);
    const [svgElem, setSvgElem] = useState(null);

    const height = props.height;
    const width = props.width;
    const margin = { top: 90, right: 90, bottom: 190, left: 90 }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom - margin.top;

    let formattedWhiteSpacedLabel = useMemo(() => addPlaceholder(LABELS.chart.axis.xAxisLabelSubtitle, /PLACEHOLDER/gi, "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"), [LABELS.chart.axis.xAxisLabelSubtitle, intervalInMs]);;
    const title = LABELS.chart.title;
    const yAxisLabel = LABELS.chart.axis.yAxisLabelTitle;
    const xAxisLabelTitle = LABELS.chart.axis.xAxisLabelTitle;
    const xAxisLabelSubtitle = formattedWhiteSpacedLabel;
    // const { timeWindowInMin, intervalInSecond } = useMemo(() => getAxisSubtitleLabelDynamicValues(timeWindowInMs, intervalInMs), [timeWindowInMs, intervalInMs]);

    const defaultYMaxDomain = 3;
    const xValue = d => d.dateObj;
    const yValue = d => +d.loadAverageLast1Min;
    const pointRadius = 5;


    const tooltipTransitionInMs = 100;
    const getTplTracePoint = (trace) => {
        const { dateString, loadAverageLast1Min } = trace;
        return (`
            <p>🕒 ${LABELS.chart.tooltip.common.time}: ${dateString}</p >
            <p>🏷 ${LABELS.chart.tooltip.common.average.specificTime}: ${loadAverageLast1Min}</p>
        `)
    }

    const getTplTemporaryReport = (report) => {
        return (`
            <h1>${LABELS.chart.tooltip[report.type].title}</h1>
            <p>🕙${LABELS.chart.tooltip.common.eventInfo.started}: ${report.startDateString} </p>
            <p>${LABELS.chart.tooltip.common.status.inProgress}</p>
        `)
    }
    const getTplFinalReport = (report) => {
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

    const tooltipTpl = (tpl) => {
        return (tpl);
    }

    useLayoutEffect(() => {
        if (svgElementRef.current) {
            setSvgElem(svgElementRef.current);
        }
        return () => null
    }, [svgElementRef]);


    useEffect(() => {
        if (traces.length && svgElem) {
            renderChart({ traces, highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, highLoadTempReportToDisplay });
        }
        return () => null
    }, [traces, highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, highLoadTempReportToDisplay,stateConfig])

    const defineMaxDomain = (data, value, defaultVal) => {
        let currentMaxInData = max(data, value);
        return currentMaxInData < defaultVal ? defaultVal : currentMaxInData;
    };


    const renderChart = ({ traces, highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, highLoadTempReportToDisplay }) => {
        select(".mainGroup").remove(); // avoid duplication before draw
        selectAll(".tooltip").remove(); // remove the tooltip when it's display on body. TODO: find a better way

        const isHighLoadInProgress = !!highLoadTempReportToDisplay;

        const tooltip = select("body").append("div") // TODO: extrat from render + ideally use mui tooltip
            .attr("class", "tooltip");

        const svg = select(svgElem)
            .attr("class", "svg");

        const mainGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.right})`)
            .attr("class", "mainGroup");
        mainGroup.append("text")
            .attr("y", -20)
            .attr("x", innerWidth / 3)
            .text(title)
            .attr("class", "title")


        // GROUPS

        //AXIS X  
        const xScale = scaleTime()
            .domain(extent(traces, xValue))
            .range([0, innerWidth]);

        const xAxis = axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickPadding(3)
            .ticks(10)

        const subLabelOffset = 30;
        const xAxisG = mainGroup.append("g")
            .attr("class", "x-axis-group")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(xAxis)

        const xAxisTextG = xAxisG.append("g")
            .attr("transform", `translate(0, 40)`)
            .attr("class", "axis-group-text");
        xAxisTextG.append("text")
            .attr("y", 0)
            .attr("x", innerWidth / 2)
            .attr("class", "axis-label")
            .text(xAxisLabelTitle)
        const subLabelComposed = xAxisTextG.append("text")
            .attr("class", "axis-subtitle-label")
            .attr("y", subLabelOffset)
            .attr("x", innerWidth / 2)
            .text(xAxisLabelSubtitle)
        subLabelComposed.append("tspan")
            .attr("class", "axis-subtitle-label--important")
            .attr("font-weight", 300)
            .attr("y", subLabelOffset)
            .attr("x", 190)
            .text(`${timeWindowInMin}`)
        subLabelComposed.append("tspan")
            .attr("class", "axis-subtitle-label--important")
            .attr("font-weight", 300)
            .attr("y", subLabelOffset)
            .attr("x", 400)
            .text(`${intervalInSecond}`);

        //AXIS Y
        const yScale = scaleLinear()
            .domain([0, defineMaxDomain(traces, yValue, defaultYMaxDomain)])
            .range([innerHeight, 0])
            .nice();

        const yAxis = axisRight(yScale)
            .tickSize(innerWidth)
            .tickPadding(10)
            .ticks(20);

        const yAxisG = mainGroup.append("g")
            .attr("class", "y-axis-group")
            .call(yAxis);

        yAxisG.append("text")
            .attr("class", "axis-label")
            .attr("y", -45)
            .attr("x", - innerHeight / 2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(yAxisLabel);


        // FRAMES 
        //utilities
        const getStartDateForDisplayFrame = report => {
            let olderTimeTrace = traces[0].dateInMs;
            return olderTimeTrace < report.startDateInMs ? report.startDateInMs : olderTimeTrace
        }

        const getWidth = (report, prop = "endDateInMs") => {
            let endDate = new Date(report[prop]);
            let startDate = new Date(getStartDateForDisplayFrame(report));
            let left = xScale(startDate);
            let right = xScale(endDate);
            return right - left;
        }

        // FRAME group
        const timeFrameGroup = mainGroup.append("g").attr("class", "timeframe");

        // TEMPORARY HIGH LOAD IN PROGRESS TODO: isolate that Same logic in file and call it into group parent
        if (isHighLoadInProgress) {
            const framesTemporaryHighLoadInProgress = timeFrameGroup
                .datum(highLoadTempReportToDisplay)
                .append("rect")
                .attr("class", "frame frame-highload-in-progress")
                .attr("height", innerHeight)
                .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
                .attr("width", d => getWidth(d, "lastUpdateInMs"))
                .on("mouseover", d => {
                    tooltip.transition()
                        .duration(tooltipTransitionInMs)
                        .style("opacity", .9);
                    tooltip.html(tooltipTpl(getTplTemporaryReport(d)))
                        .style("left", `${event.pageX}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", d => {
                    tooltip.transition()
                        .duration(tooltipTransitionInMs)
                        .style("opacity", 0);
                });

        }

        // HIGH LOAD FINAL REPORT 
        const framesHighLoad = timeFrameGroup
            .selectAll('frame-highload')
            .data(highLoadFinalReportsToDisplay);
        framesHighLoad.enter()
            .append("rect")
            .merge(framesHighLoad)
            .attr("class", "frame frame-highload")
            .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
            .attr("width", d => getWidth(d))
            .attr("height", innerHeight)
            .on("mouseover", d => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", .9);
                tooltip.html(tooltipTpl(getTplFinalReport(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", d => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", 0);
            });

        framesHighLoad.exit()
            .remove()


        // RECOVERY FINAL REPORT   
        const framesRecovery = timeFrameGroup
            .selectAll('frame-recovery')
            .data(recoveryFinalReportsToDisplay);
        framesRecovery.enter()
            .append("rect")
            .merge(framesRecovery)
            .attr("class", "frame frame-recovery")
            .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
            .attr("width", d => getWidth(d))
            .attr("height", innerHeight)
            .on("mouseover", d => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", .9);
                tooltip.html(tooltipTpl(getTplFinalReport(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", d => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", 0);
            });
        framesRecovery.exit()
            .remove()

        // MAX LINE
        const maxLoadAverage = mainGroup.append("g")
            .attr("class", "max-group")

        maxLoadAverage.append("line")
            .attr("class", "max-line")
            .attr("x1", 0)
            .attr("y1", yScale(loadAverageByCpuConsiredAsHigh))
            .attr("x2", innerWidth)
            .attr("y2", yScale(loadAverageByCpuConsiredAsHigh));
        maxLoadAverage.append("text")
            .attr("y", yScale(loadAverageByCpuConsiredAsHigh))



        // LINES TRACES    
        const lineGenerator = line()
            .x(d => xScale(xValue(d)))
            .y(d => yScale(yValue(d)))

        const lineGroup = mainGroup.append("g")
            .attr("class", "line-group")

        lineGroup.append("path")
            .datum(traces)
            .attr("class", "lines data-line")
            .attr("d", d => lineGenerator(d))


        // POINTS ALWAYS ON TOP OF LINES
        lineGroup.selectAll("line-circle")
            .data(traces)
            .enter().append("circle")
            .attr("class", "data-circle")
            .attr("r", pointRadius)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .on("mouseover", d => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", .9);
                tooltip.html(tooltipTpl(getTplTracePoint(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 30}px`);
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(tooltipTransitionInMs)
                    .style("opacity", 0);
            });


        // TODO: Legend needs to be totally outside
        const legendWidth = innerWidth;
        const legendHeight = 100;
        const legendYOffset = 10;
        const legendRadius = 10;
        const legendElementPadding = 20;
        const legendPointRadius = pointRadius;

        const dataLegendCircle = [
            {
                title: LABELS.chart.legend.timeFrames.highLoad.title,
                class: "frame frame-highload",
                radius: legendRadius
            },
            {
                title: LABELS.chart.legend.timeFrames.recovery.title,
                class: "frame frame-recovery",
                radius: legendRadius
            },
            {
                title: LABELS.chart.legend.points.title,
                class: "data-circle",
                radius: legendPointRadius
            }
        ]


        const legendGroupEnter = mainGroup.append("g")
            .attr("transform", `translate(0, ${innerHeight - legendHeight + margin.bottom - legendYOffset})`);
        legendGroupEnter.call(Legend, {
            dataLegendCircle,
            spacing: 30,
            circleRadius: legendRadius,
            textOffset: 15,
            padding: legendElementPadding
        });

        legendGroupEnter.append("rect")
            .attr("class", "legend")
            .attr("width", legendWidth)
            .attr("height", legendHeight);
            
        const dashGroup = legendGroupEnter.append("g");


        dashGroup.append("rect")
            .attr("x", `${innerWidth - 250 - legendElementPadding}`)
            .attr("y", `${legendElementPadding + 5}`)
            .attr("width", 60)
            .attr("height", .5)
            .attr("class", "max-line")

        dashGroup.append("text")
            .attr("x", `${innerWidth - 180 - legendElementPadding}`)
            .attr("y", `${legendElementPadding}`)
            .text(`${LABELS.chart.legend.limit.title} : ${loadAverageByCpuConsiredAsHigh}`)
            .attr("dy", 10)
            .attr("class", "legend-label")
    }

    //TODO: use theming
    return (
        <Box display="flex">
            <svg
                // style={{backgroundColor: grey[200]}}
                width={props.width}
                height={props.height}
                ref={svgElementRef}
            >
            </svg>
        </Box>
    );


}


export default Chart


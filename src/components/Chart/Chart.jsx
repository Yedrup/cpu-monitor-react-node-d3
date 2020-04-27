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

import clsx from 'clsx';
import { ConfigContext } from '../../data/reducers/ConfigContext';
import { DataStateContext } from '../../data/reducers/DataContext';

import Legend from "./utilities/Legend";
import { getTplTracePoint, getTplTemporaryReport, getTplFinalReport } from "./utilities/Tooltips";
import { addPlaceholder } from "../../utilities/utilities";

import * as LABELS from "../../data/labels.json"

import { Card, CardContent, CardHeader, withStyles } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import './Chart.css';


const useStyles = makeStyles((theme) => {
    let isDarkTheme = theme.palette.type === "dark";
    return ({
        cardContent: {
            width: "100%",
        },
        tooltipVisible: {
            padding: ".5rem 1rem",
            font: "1rem",
            fontWeight: "bold",
            backgroundColor: fade(theme.palette.primary.darker, .8),
            color: theme.palette.primary.lighter,
            border: 0,
            opacity: 1,
            borderRadius: theme.shape.borderRadius
        },
        svg: {
            width: "100%",
            height: "100%",
            border: isDarkTheme ? fade(theme.palette.primary.light, .1) : fade(theme.palette.primary.light, .1)
        },
        axisLabel: {
            fill: theme.palette.primary.contrastText,
            stroke: fade(theme.palette.primary.contrastText, .2),
            fontSize: "1.25rem"
        },
        axisSubtitleLabel: {
            fill: isDarkTheme ? theme.palette.grey[400] : theme.palette.grey[600],
            stroke: isDarkTheme ? fade(theme.palette.grey[400], .2) : fade(theme.palette.grey[600], .2),
            fontSize: "1rem"
        },
        axisSubtitleLabelOverlined: {
            stroke: fade(theme.palette.primary.dark, .8),
            fill: theme.palette.primary.main,
        },
        ticks: {
            color: isDarkTheme ? theme.palette.grey[500] : theme.palette.grey.main
        },
        legend: {
            fill: fade(theme.palette.primary.main, .1),
        },
        legendLabel: {
            fill: isDarkTheme ? theme.palette.grey[400] : theme.palette.grey[600],
            fontWeight: "bold",
        },
        maxLine: {
            stroke: theme.palette.error.dark,
            strokeWidth: "2px",
        },
        lines: {
            strokeWidth: "4px",
            fill: "none",
        },
        dataLine: {
            stroke: isDarkTheme ? theme.palette.primary.dark : theme.palette.primary.darker,
            mixBlendMode: "hard-light",
            strokeLinejoin: "miter",
        },
        dataCircle: {
            fill: isDarkTheme? theme.palette.primary.lighter : theme.palette.primary.darker
        },
        frameHighLoad: {
            fill: isDarkTheme ? fade(theme.palette.error.main, .4) : fade(theme.palette.error.main, .5)
        },
        frameRecovery: {
            fill: isDarkTheme ? fade(theme.palette.success.main, .4) : fade(theme.palette.success.main, .5)
        }
    })
});

// need to import it, same as other cards
const CardHeaderCustom = withStyles((theme) => ({
    root: {
        textAlign: "left",
        height: "2rem",
        alignItems: "baseline",
        justifyContent: "baseline",
        paddingBottom: 0,
    },
    title: {
        color: theme.palette.primary.contrastText,
        fontSize: "1rem"
    },
    subheader: {
        color: theme.palette.grey
    }
}))(CardHeader);



function Chart(props) {
    const classes = useStyles();

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
    } = stateConfig

    let timeWindowInMin = stateConfig.getTimeWindowInMin();
    let intervalInSecond = stateConfig.getTimeIntervalInSec();
    const svgElementRef = useRef(null);
    const [svgElem, setSvgElem] = useState(null);

    const height = props.height;
    const width = props.width;
    const margin = { top: 0, right: 30, bottom: 200, left: 60 }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.bottom - margin.top;

    let formattedWhiteSpacedLabel = useMemo(() => addPlaceholder(LABELS.chart.axis.xAxisLabelSubtitle, /PLACEHOLDER/gi, "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"), []);;
    const title = LABELS.chart.title;
    const yAxisLabel = LABELS.chart.axis.yAxisLabelTitle;
    const xAxisLabelTitle = LABELS.chart.axis.xAxisLabelTitle;
    const xAxisLabelSubtitle = formattedWhiteSpacedLabel;

    const yLabelOffset = -20;
    const defaultYMaxDomain = 2;
    const xValue = d => d.dateObj;
    const yValue = d => +d.loadAverageLast1Min;
    const pointRadius = 5;

    const legendWidth = innerWidth;
    const legendHeight = 100;
    const legendYOffset = -20;
    const legendRadius = 10;
    const legendElementPadding = 20;
    const legendPointRadius = pointRadius;

    const dataLegendCircle = [
        {
            title: LABELS.chart.legend.timeFrames.highLoad.title,
            class: `${classes.frameHighLoad}`,
            radius: legendRadius
        },
        {
            title: LABELS.chart.legend.timeFrames.recovery.title,
            class: `${classes.frameRecovery}`,
            radius: legendRadius
        },
        {
            title: LABELS.chart.legend.points.title,
            class: `${classes.dataCircle}`,
            radius: legendPointRadius
        }
    ]


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
        // eslint-disable-next-line
    }, [traces, highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, highLoadTempReportToDisplay, stateConfig, props])

    const defineMaxDomain = (data, value, defaultVal) => {
        let currentMaxInData = max(data, value);
        return currentMaxInData < defaultVal ? defaultVal : currentMaxInData;
    };


    const renderChart = ({ traces, highLoadFinalReportsToDisplay, recoveryFinalReportsToDisplay, highLoadTempReportToDisplay }) => {
        // avoid duplication before draw
        select(".mainGroup").remove();
        selectAll(".tooltip").remove(); 

        const tooltip = select("body").append("div")
            .attr("class", "tooltip")
        const isHighLoadInProgress = !!highLoadTempReportToDisplay;


        const svg = select(svgElem)
            .attr("class", `${classes.svg}`);

        const mainGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.right})`)
            .attr("class", "mainGroup");

        // GROUPS
        //AXIS X  
        const xScale = scaleTime()
            .domain(extent(traces, xValue))
            .range([0, innerWidth]);

        const xAxis = axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickPadding(3)
            .ticks(10)

        const subLabelOffset = 40;
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
            .attr("class", `${classes.axisLabel}`)
            .text(xAxisLabelTitle)
        const subLabelComposed = xAxisTextG.append("text")
            .attr("class", `${classes.axisSubtitleLabel}`)
            .attr("y", subLabelOffset)
            .attr("x", innerWidth / 2)
            .text(xAxisLabelSubtitle)
        subLabelComposed.append("tspan")
            .attr("class", `${classes.axisSubtitleLabelOverlined}`)
            .attr("font-weight", 300)
            .attr("y", subLabelOffset)
            .attr("x", 235)
            .text(`${timeWindowInMin}`)
        subLabelComposed.append("tspan")
            .attr("class", `${classes.axisSubtitleLabelOverlined}`)
            .attr("font-weight", 300)
            .attr("y", subLabelOffset)
            .attr("x", 445)
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
            .attr("class", `${classes.axisLabel}`)
            .attr("y", yLabelOffset)
            .attr("x", - innerHeight / 2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(yAxisLabel);

        const ticks = selectAll(".tick");
        ticks.attr("class", `${classes.ticks}`)

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
        const timeFrameGroup = mainGroup.append("g");
        // TEMPORARY HIGH LOAD IN PROGRESS 
        if (isHighLoadInProgress) {
            // eslint-disable-next-line
            const framesTemporaryHighLoadInProgress = timeFrameGroup
                .datum(highLoadTempReportToDisplay)
                .append("rect")
                .attr("class", `${classes.frameHighLoad}`)
                .attr("height", innerHeight)
                .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
                .attr("width", d => getWidth(d, "lastUpdateInMs"))
                .on("mouseover", d => {
                    tooltip.classed(`${classes.tooltipVisible}`, true);
                    tooltip.html(tooltipTpl(getTplTemporaryReport(d)))
                        .style("left", `${event.pageX}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", d => {
                    tooltip.classed(`${classes.tooltipVisible}`, false)
                });

        }

        // HIGH LOAD FINAL REPORT 
        const framesHighLoad = timeFrameGroup
            .selectAll(`${classes.frameHighLoad}`)
            .data(highLoadFinalReportsToDisplay);
        framesHighLoad.enter()
            .append("rect")
            .merge(framesHighLoad)
            .attr("class", `${classes.frameHighLoad}`)
            .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
            .attr("width", d => getWidth(d))
            .attr("height", innerHeight)
            .on("mouseover", d => {
                tooltip.classed(`${classes.tooltipVisible}`, true)
                tooltip.html(tooltipTpl(getTplFinalReport(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", d => {
                tooltip.classed(`${classes.tooltipVisible}`, false);
            });

        framesHighLoad.exit()
            .remove()


        // RECOVERY FINAL REPORT   
        const framesRecovery = timeFrameGroup
            .selectAll(`${classes.frameRecovery}`)
            .data(recoveryFinalReportsToDisplay);
        framesRecovery.enter()
            .append("rect")
            .merge(framesRecovery)
            .attr("class", `${classes.frameRecovery}`)
            .attr("x", d => xScale(new Date(getStartDateForDisplayFrame(d))))
            .attr("width", d => getWidth(d))
            .attr("height", innerHeight)
            .on("mouseover", d => {
                tooltip.classed(`${classes.tooltipVisible}`, true);
                tooltip.html(tooltipTpl(getTplFinalReport(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", d => {
                tooltip.classed(`${classes.tooltipVisible}`, false)
            });
        framesRecovery.exit()
            .remove()

        // MAX LINE
        const maxLoadAverage = mainGroup.append("g");
        maxLoadAverage.append("line")
            .attr("class", `${classes.maxLine}`)
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
            .attr("class", `${clsx(classes.lines, classes.dataLine)}`)
            .attr("d", d => lineGenerator(d));

        // POINTS ALWAYS ON TOP OF LINES
        lineGroup.selectAll("line-circle")
            .data(traces)
            .enter().append("circle")
            .attr("class", `${classes.dataCircle}`)
            .attr("r", pointRadius)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .on("mouseover", d => {
                tooltip.classed(`${classes.tooltipVisible}`, true);
                tooltip.html(tooltipTpl(getTplTracePoint(d)))
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 30}px`);
            })
            .on("mouseout", () => {
                tooltip.classed(`${classes.tooltipVisible}`, false);
            });

        const legendGroupEnter = mainGroup.append("g")
            .attr("transform", `translate(0, ${innerHeight - legendHeight + margin.bottom - legendYOffset})`);

        legendGroupEnter.append("rect")
            .attr("class", `${classes.legend}`)
            .attr("width", legendWidth)
            .attr("height", legendHeight);

        legendGroupEnter.call(Legend, {
            dataLegendCircle,
            spacing: 30,
            circleRadius: legendRadius,
            textOffset: 15,
            className: `${classes.legendLabel}`,
            padding: legendElementPadding
        });


        const dashGroup = legendGroupEnter.append("g");
        dashGroup.append("rect")
            .attr("x", `${innerWidth - 250 - legendElementPadding}`)
            .attr("y", `${legendElementPadding}`)
            .attr("width", 60)
            .attr("height", .5)
            .attr("class", `${classes.maxLine}`)

        dashGroup.append("text")
            .attr("x", `${innerWidth - 180 - legendElementPadding}`)
            .attr("y", `${legendElementPadding - 5}`)
            .text(`${LABELS.chart.legend.limit.title} : ${loadAverageByCpuConsiredAsHigh}`)
            .attr("dy", 10)
            .attr("class", `${classes.legendLabel}`)
    }

    return (
        <Card display="flex" elevation={2}>
            <CardHeaderCustom
                title={title}
            />
            <CardContent className={classes.cardContent}>
                <svg
                    viewBox={`0 0 ${850} ${650} `}
                    ref={svgElementRef}
                >
                </svg>
            </CardContent>
        </Card>
    );


}


export default Chart


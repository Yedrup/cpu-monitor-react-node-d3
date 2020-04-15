
const legend = (elementParent, props) => {
    const { dataLegendCircle, spacing, circleRadius, textOffset, padding } = props;
    const groups = elementParent.selectAll("g")
        .data(dataLegendCircle);

    const groupsEnter = groups.enter()
        .append("g")

    groupsEnter
        .merge(groups)
        .attr('transform', (d, i) =>
            `translate(${padding}, ${(i * spacing) + padding })`
        );
    groups.exit().remove()

    groupsEnter.append("circle")
        .merge(groups.select("circle"))
        .attr("r", circleRadius)
        .attr("class", d => d.class)

    groupsEnter.append("text")
        .merge(groups.select("text"))
        .attr("x", textOffset)
        .attr("dy", ".3rem")
        .text(d => d.title)
        .attr("class", "legend-label")
}



export default legend
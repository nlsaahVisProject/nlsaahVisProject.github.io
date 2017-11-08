
function drawLinkedButton(svgIn, svgWidthIn, svgHeightIn, rectHeightIn, rectWidthIn, pathIn, displayWordIn) {

    var svg = d3.select(svgIn)
        .attr("width", svgWidthIn)
        .attr("height", svgHeightIn);

    var g = svg.selectAll("g").append("g");

    // draw a rectangle
    var rectangle = svg.append("a")
        .attr("href", pathIn)
        .attr("target", "_blank")
        .append("rect")
        .attr("x", (svgWidthIn - rectWidthIn)/2)
        .attr("y", (svgHeightIn - rectHeightIn)/2)
        .attr("height", rectHeightIn)
        .attr("width", rectWidthIn)
        .style("fill", "lightgreen")
        .attr("rx", 10)
        .attr("ry", 10);

    // draw text on the screen
    svg.append("text")
        .attr("x", svgWidthIn/2)
        .attr("y", svgHeightIn/2)
        .style("fill", "black")
        .style("font-size", "20px")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(displayWordIn);
}
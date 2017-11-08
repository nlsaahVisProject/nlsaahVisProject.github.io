function drawLegend(paramsIn) {
    var svg = d3.select(paramsIn.divClass).append("svg")
        .attr("width", paramsIn.svgDims.width)
        .attr("height", paramsIn.svgDims.height - 50);

    var dLength = 0;
    var offset = paramsIn.offset; //Make parameter

    var legends = svg.selectAll("g")
        .data(paramsIn.values)
        .enter().append("g")
        .attr("transform", function (d, i) {
            if (i === 0){
                return "translate(0, 0)"
           } else {
                return "translate(0," + i*15 + ")"
            }
        });

    legends.append("rect")
        .attr("x", 0)
        .attr("y", 5)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return paramsIn.color(i)
        });

    legends.append('text')
        .attr("x", 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(function (d, i) {
            return d
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", "15px")
}

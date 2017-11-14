var Sunburst = function () {
    var newSunburst = {
        drawSunburst: function(fileIn, svgIn, inputIn, dimIn) {

            var width = dimIn.width,
                height = dimIn.height,
                radius = Math.min(width, height) / 2,
                color = d3.scaleOrdinal(d3.schemeCategory10),
                pattern = /Wave/;


            var g = d3.select(svgIn)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            // Sunburst data structure.
            var partition = d3.partition()
                .size([2 * Math.PI, radius]);

            d3.json(fileIn, function(error, nodeData) {
                if (error) throw error;


                var root = d3.hierarchy(nodeData)
                    .sum(function (d) { return d.size; })
                    .sort(function(a, b) { return b.value - a.value; });

                partition(root);

                arc = d3.arc()
                    .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
                    .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
                    .innerRadius(function (d) { return d.y0; })
                    .outerRadius(function (d) { return d.y1; });

                var segment = g.selectAll('g')
                    .data(root.descendants())
                    .enter().append('g').attr("class", "node");

                segment
                    .append('path')
                    .attr("d", arc)
                    .style('stroke', '#fff')
                    .style("fill", function (d) {
                        return d.data.name === "top" ? "white" : color((d.children ? d : d.parent).data.name); })
                    .on("click", function (d) {
                        d.data.name === "top" ? window.open("waves_cross/explore_waves_cross.html") :
                        pattern.test(d.data.name) ? window.open(d.data.link) :
                        null;
                    })
                    .on("mouseover", function (d) {
                        d.data.name === "top" ? d3.select(this).style("fill", "black").style("opacity", "0.2") :
                        pattern.test(d.data.name) ? d3.select(this).style("opacity", "0.4") :
                        null;
                    })
                    .on("mouseout", function (d) {
                        d.data.name === "top" ? d3.select(this).style("fill", "white") :
                        pattern.test(d.data.name) ? d3.select(this).style("opacity", "1") :
                        null;
                    });

                var text = segment.append("text")
                    .attr("transform", function(d) {
                        return d.data.name !== "top" ? "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")" : null;
                    })
                    .attr("text-anchor", "middle")
                    .attr("dx", "0") // margin
                    .attr("dy", ".35em") // vertical-align
                    .attr("font-weight", function (d) {
                        return pattern.test(d.data.name) ? "bold" : "normal";
                    })
                    .text(function (d) {
                        return d.data.name === "top" ? "Compare All Waves" :
                               pattern.test(d.data.name) ? d.data.name :
                               d.data.name === "total" ? d.data.size :
                               null;
                    })
                    .on("click", function (d) {
                        d.data.name === "top" ? window.open("waves_cross/explore_waves_cross.html") :
                        pattern.test(d.data.name) ? window.open(d.data.link) :
                        null;
                    });


                d3.selectAll(inputIn).on("click", function(d,i) {

                    if (this.value === "size") {
                        root.sum(function (d) { return d.size; });
                    } else {
                        root.count();
                    }

                    partition(root);

                    segment.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);
                });
            });

            function arcTweenPath(a, i) {

                var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

                function tween(t) {
                    var b = oi(t);
                    a.x0s = b.x0;
                    a.x1s = b.x1;
                    return arc(b);
                }
                return tween;
            }

            function computeTextRotation(d) {
                var angle = (d.x0 + d.x1) / Math.PI * 90;

                return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
            }
        }
    };
    return newSunburst;
};
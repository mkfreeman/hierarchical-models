// ScatterPlot
import * as d3 from 'd3';
import d3tip from 'd3-tip';

var ScatterPlot = function () {
    // Set default values
    var height = 500,
        width = window.innerWidth * .7,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        duration = 1000,
        hideAxes = false,
        colorScale = (d) => d.color || 'green',
        radius = (d) => 6,
        margin = {
            left: 70,
            bottom: 50,
            top: 0,
            right: 50
        },
        delay = (d) => xScale(d.x) * 5,
        pack = false,
        packGroup = 'group',
        packValue = 'y',
        yFormat = (d) => "$" + d3.format(".2s")(d)

    // Function returned by ScatterPlot
    var chart = function (selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // Iterate through selections, in case there are multiple
        selection.each(function (data) {
            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele
                .selectAll("svg")
                .attr('width', width)
                .attr("height", height)
                .data([data]);

            // Append static elements (i.e., only added once)
            var gEnter = svg
                .enter()
                .append("svg")
                .append("g");

            // g element for markers
            gEnter
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('height', chartHeight)
                .attr('width', chartWidth)
                .attr('class', 'chartG');

            // Append axes to the gEnter element
            gEnter
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'axis x')
                .style('opacity', hideAxes == true
                    ? 0
                    : 1);

            gEnter
                .append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                .style('opacity', hideAxes == true
                    ? 0
                    : 1);

            // Add a title g for the x axis
            gEnter
                .append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x')
                .style('opacity', hideAxes == true
                    ? 0
                    : 1);

            // Add a title g for the y axis
            gEnter
                .append('text')
                .attr('transform', 'translate(' + (margin.left - 50) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('class', 'title y')
                .style('opacity', hideAxes == true
                    ? 0
                    : 1);

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom();
            var yAxis = d3.axisLeft();

            // // Define a hover
            var tip = d3tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>" + d.color + "</strong>";
                });

            ele
                .select('svg')
                .call(tip);
            // Calculate x and y scales
            let xMax = d3.max(data.scatter, (d) => + d.x) * 1.05;
            let xMin = d3.min(data.scatter, (d) => + d.x) - xMax / 15;
            xScale
                .range([0, chartWidth])
                .domain([xMin, xMax]);

            var yMin = d3.min(data.scatter, (d) => + d.y) * .95;
            var yMax = d3.max(data.scatter, (d) => + d.y) * 1.05;
            yScale
                .range([chartHeight, 0])
                .domain([yMin, yMax]);

            // Update axes
            xAxis.scale(xScale);
            yAxis
                .scale(yScale)
                .tickFormat(yFormat);
            ele
                .select('.axis.x')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .transition()
                .delay(hideAxes != true
                    ? duration
                    : 0)
                .duration(1000)
                .style('opacity', hideAxes == true
                    ? 0
                    : 1)
                .call(xAxis);
            ele
                .select('.axis.y')
                .transition()
                .duration(1000)
                .delay(hideAxes != true
                    ? duration
                    : 0)
                .style('opacity', hideAxes == true
                    ? 0
                    : 1)
                .call(yAxis);

            // Update titles
            ele
                .select('.title.x')
                .text(xTitle)
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .transition()
                .delay(hideAxes != true
                    ? duration
                    : 0)
                .duration(duration)
                .style('opacity', hideAxes == true
                    ? 0
                    : 1)
            ele
                .select('.title.y')
                .attr('transform', 'translate(' + (margin.left - 50) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .text(yTitle)
                .transition()
                .delay(hideAxes != true
                    ? duration
                    : 0)
                .duration(duration)
                .style('opacity', hideAxes == true
                    ? 0
                    : 1)

            // Define data
            var chartData;
            if (pack == true) {
                // Create a packing function to pack circles
                let size = d3.min([width, height]);
                var packer = d3
                    .pack()
                    .size([size, size]);
                // Nest your data *by group* using d3.nest()
                var nestedData = d3
                    .nest()
                    .key(function (d) {
                        return d[packGroup];
                    })
                    .entries(data.pack);

                // Define a hierarchy for your data using d3.hierarchy
                var root = d3.hierarchy({
                    values: nestedData
                }, function (d) {
                    return d.values;
                })
                    .sum(function (d) {
                        return + d[packValue];
                    });
                // (Re)build your pack hierarchy data structure by passing your `root` to your
                // `pack` function
                packer(root);
                chartData = root
                    .descendants()
                    .filter((d) => d.depth != 0)
                    .map(function (d) {
                        return {
                            x: d.x,
                            y: d.y,
                            id: d.data.id,
                            color: d.data.color,
                            r: d.r,
                            container: d.depth == 1
                        }
                    });
                xMin = d3.min(chartData, (d) => d.x)
                xMax = d3.max(chartData, (d) => d.x)
                // Adjust for margins
                let shift = margin.left;
                let range = [
                    xMin - shift,
                    xMax - shift
                ]
                xScale
                    .domain([xMin, xMax])
                    .range(range)
                yMin = d3.min(chartData, (d) => d.y)
                yMax = d3.max(chartData, (d) => d.y)
                yScale
                    .domain([yMin, yMax])
                    .range([yMin, yMax])
                radius = (d) => d.r
            } else {
                chartData = data.scatter;
            }
            
            // Draw markers
            let circles = ele
                .select('.chartG')
                .selectAll('circle')
                .data(chartData, function (d) {
                    return d.id
                })
            // Use the .enter() method to get entering elements, and assign initial position
            circles
                .enter()
                .append('circle')
                .style('opacity', .3)
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y))
                .attr('r', 0)
                // .on('mouseover', tip.show) .on('mouseout', tip.hide) Transition properties of
                // the + update selections
                .merge(circles)
                .transition()
                .duration(1500)
                .delay(delay)
                // .style('fill', (d) => colorScale(d.color))
                .style('fill', function (d) {
                    return d.container == true
                        ? 'none'
                        : colorScale(d.color)
                })
                .style('stroke', (d) => d.container == true
                    ? 'black'
                    : 'none')
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y))
                .attr('r', (d) => radius(d));

            // Use the .exit() and .remove() methods to remove elements that are no longer
            // in the data
            circles
                .exit()
                .remove();

            // Lines!
            let lines = ele
                .select('.chartG')
                .selectAll('line')
                .data(data.line, (d) => d.key);

            // Handle entering elements (see README.md)
            lines
                .enter()
                .append("line")
                .attr('x1', function (d) {
                    return xScale(d.values[0].x)
                })
                .attr('x2', (d) => xScale(d.values[0].x))
                .attr('y1', (d) => yScale(d.values[0].y))
                .attr('y2', (d) => yScale(d.values[0].y))
                .attr("fill", "none")
                .attr("stroke", function (d) {
                    return colorScale(d.key)
                })
                .attr("stroke-width", 1.5)
                .transition()
                .delay(duration)
                .duration(duration)
                .attr('x1', function (d) {
                    return xScale(d.values[0].x)
                })
                .attr('y1', (d) => yScale(d.values[0].y))
                .attr('x2', (d) => xScale(d.values[1].x))
                .attr('y2', (d) => yScale(d.values[1].y))

            lines
                .transition()
                .duration(duration)
                .attr('x1', function (d) {
                    return xScale(d.values[0].x)
                })
                .attr('y1', (d) => yScale(d.values[0].y))
                // .attr('x2', (d) => xScale(d.values[0].x))
                .attr('x2', (d) => xScale(d.values[1].x))
                .attr('y2', (d) => yScale(d.values[1].y))
                .delay(function (d, i) {
                    return i * 500
                })

            lines
                .exit()
                .remove()
        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function (value) {
        if (!arguments.length) 
            return height;
        height = value;
        return chart;
    };

    chart.width = function (value) {
        if (!arguments.length) 
            return width;
        width = value;
        return chart;
    };

    chart.colorScale = function (value) {
        if (!arguments.length) 
            return colorScale;
        colorScale = value;
        return chart;
    };

    chart.xTitle = function (value) {
        if (!arguments.length) 
            return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function (value) {
        if (!arguments.length) 
            return yTitle;
        yTitle = value;
        return chart;
    };
    chart.radius = function (value) {
        if (!arguments.length) 
            return radius;
        radius = value;
        return chart;
    }
    chart.pack = function (value) {
        if (!arguments.length) 
            return pack;
        pack = value;
        return chart;
    }
    chart.packValue = function (value) {
        if (!arguments.length) 
            return packValue;
        packValue = value;
        return chart;
    }
    chart.packGroup = function (value) {
        if (!arguments.length) 
            return packGroup;
        packGroup = value;
        return chart;
    }
    chart.delay = function (value) {
        if (!arguments.length) 
            return delay;
        delay = value;
        return chart;
    };
    chart.margin = function (value) {
        if (!arguments.length) 
            return margin;
        margin = value;
        return chart;
    };

    chart.hideAxes = function (value) {
        if (!arguments.length) 
            return hideAxes;
        hideAxes = value;
        return chart;
    };
    return chart;
};

export default ScatterPlot;

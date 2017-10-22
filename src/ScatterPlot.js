// ScatterPlot
import * as d3 from 'd3';
import d3tip from 'd3-tip';

var ScatterPlot = function() {
    // Set default values
    var height = 500,
        width = 500,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        colorScale = (d) => d.color || 'green',
        fill = (d) => colorScale(d),
        radius = (d) => 6,
        margin = {
            left: 70,
            bottom: 50,
            top: 0,
            right: 50,
        },
        delay = (d) => xScale(d.x) * 5

    // Function returned by ScatterPlot
    var chart = function(selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // Iterate through selections, in case there are multiple
        selection.each(function(data) {

            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            // Append static elements (i.e., only added once)
            var gEnter = svg.enter()
                .append("svg")
                .attr('width', width)
                .attr("height", height)
                .append("g");

            // g element for markers
            gEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('height', chartHeight)
                .attr('width', chartWidth)
                .attr('class', 'chartG');


            // Append axes to the gEnter element
            gEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'axis x');

            gEnter.append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            gEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x');

            // Add a title g for the y axis
            gEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('class', 'title y');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom();
            var yAxis = d3.axisLeft();

            // // Define a hover
            var tip = d3tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>" + d.id + "</strong>";
                });

            ele.select('svg').call(tip);

            // Calculate x and y scales
            let xMax = d3.max(data, (d) => +d.x) * 1.05;
            let xMin = d3.min(data, (d) => +d.x) * .95;
            xScale.range([0, chartWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d.y) * .95;
            var yMax = d3.max(data, (d) => +d.y) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);

            // Update axes
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.axis.x').transition().duration(1000).call(xAxis);
            ele.select('.axis.y').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.title.x').text(xTitle)
            ele.select('.title.y').text(yTitle)

            // Draw markers
            let circles = ele.select('.chartG').selectAll('circle').data(data, (d) => d.id);

            // Use the .enter() method to get entering elements, and assign initial position
            circles.enter().append('circle')
                .attr('fill', fill)
                // .attr('cy', chartHeight)
                .style('opacity', .3)
                .attr('cx', (d) => xScale(d.x))
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                // Transition properties of the + update selections
                .merge(circles)
                .attr('r', radius)
                .transition()
                .duration(1500)
                .delay(delay)
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y))

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            circles.exit().remove();
        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.colorScale = function(value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return chart;
    };

    chart.xTitle = function(value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function(value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };
    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    }
    chart.delay = function(value) {
        if (!arguments.length) return delay;
        delay = value;
        return chart;
    };

    return chart;
};


export default ScatterPlot;

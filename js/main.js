"use strict";

var plotChart = function(data) {

    // Path for states to be drawn
    var path = d3.geoPath();

    // Initialize xScale
    var xScale = d3.scaleLinear()
        .domain([0, 40])
        .range([0, 1000]);

    // Append chart group
    var chart = d3.select("svg")
        .append("g")
        .attr("class", "chart");

    // Initialize axis
    var axis = d3.axisBottom(xScale)
        .ticks(5);

    // Append data-rectangle
    chart.append("rect")
        .attr("x", 250)
        .attr("y", 650)
        .attr("height", 75)
        .attr("width", 1000)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Append axis
    chart.append("g")
        .attr("class", "scale")
        .attr("transform", "translate(250, 725)")
        .call(axis);

    // Append axis label
    chart.append("text")
        .attr("transform", "translate(1283, 746)")
        .style("text-anchor", "middle")
        .style("font-size", "large")
        .text("ug/L");

    // Draw states
    chart.append("g")
        .attr("class", "states")
        .attr("transform", "translate(275, 0)")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.states).features)
        .enter().append("path")
        .attr("d", path);
};

var plotCoordinates = function(data) {

    // Select the chart, initialize color scheme for sites
    var chart = d3.select("g.chart");
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Initialize xScale
    var xScale = d3.scaleLinear()
        .domain([0, 40])
        .range([0, 1000]);

    // Add grouping to append the sites to
    chart.append("g")
        .attr("class", "sites")
        .attr("transform", "translate(275, 0)");

    // Read in data
    d3.csv(data)
        .then(function(d) {

            // Select sites grouping
            var sites = d3.select("g.sites");
            var values = d3.values(d);

            // Iterate through site coordinates from data file
            for(var v in values) {

                var xCoord = values[v].x;
                var yCoord = values[v].y;
                var ugl    = values[v].ugl;

                // Append circle that represents the site
                if (!isNaN(xCoord) && !isNaN(yCoord)) {
                    var mapSite = sites.append("circle")
                        .attr("cx", xCoord)
                        .attr("cy", yCoord)
                        .attr("r", 10)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("fill", color(v))
                        .style("opacity", 0);

                    // Fade in / stagger site animation
                    mapSite
                        .transition()
                        .delay(function() {
                            if(!isNaN(v)) {
                                return 500 * v;
                            }
                        })
                        .duration(250)
                        .style("opacity", 1);

                    // Append circle that correlates to site
                    var dataSite = chart.append("circle")
                        .attr("cx", 250 + xScale(ugl))
                        .attr("cy", 600)
                        .attr("r", 10)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("fill", color(v))
                        .style("opacity", 0);

                    // Fade in / stagger bounce animation
                    dataSite
                        .transition()
                        .delay(function() {
                            if(!isNaN(v)) {
                                return 500 * v;
                            }
                        })
                        .duration(1000)
                        .ease(d3.easeBounce)
                        .attr("cy", 688.5)
                        .style("opacity", 1);
                }
            }

        }) // Catch errors during loading
        .catch(function (reason) {
            console.log("Error loading csv file - " + reason);
        })
};
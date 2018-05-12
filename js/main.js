"use strict";

// Initialize xScale
var xScale = d3.scaleLinear()
    .domain([0, 40])
    .range([0, 1000]);

$(document).ready(function () {

    var svg = d3.select("svg");
    var path = d3.geoPath();

    d3.json("data/usa-map.json")
        .then(function (data) {

            // Draw chart
            plotChart();

            // Draw states
            svg.append("g")
                    .attr("class", "states")
                    .attr("transform", "translate(275, 0)")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.states).features)
                .enter().append("path")
                    .attr("d", path)

        })  // Catch errors loading the json data
        .catch(function (reason) {
            console.log("Error loading json file - " + reason);
        }) // When the states are done
        .finally(function () {

            // Draw the sites sampled
            d3.csv("data/coordinates.csv")
                .then(function(data) {
                    svg.append("g")
                        .attr("class", "sites")
                        .attr("transform", "translate(275, 0)");

                    var sites = d3.select("g.sites");
                    var chart = d3.select("g.chart");

                    // Iterate through site coordinates
                    for(var site in data) {

                        var xCoord = data[site].x;
                        var yCoord = data[site].y;
                        var amount = data[site].ugl;

                        // Append circle that represents the site
                        if (!isNaN(xCoord) && !isNaN(yCoord)) {
                            var mapSite = sites.append("circle")
                                .attr("cx", xCoord)
                                .attr("cy", yCoord)
                                .attr("r", 10)
                                .attr("stroke", "black")
                                .attr("stroke-width", 1)
                                .attr("fill", "cyan")
                                .style("opacity", 0);

                            // Fade in / stagger site animation
                            mapSite
                                .transition()
                                .delay(function() {
                                    if(!isNaN(site)) {
                                        return 500 * site;
                                    }
                                })
                                .duration(250)
                                .style("opacity", 1);

                            // Append circle that correlates to site
                            var dataSite = chart.append("circle")
                                .attr("cx", 250 + xScale(amount))
                                .attr("cy", 600)
                                .attr("r", 10)
                                .attr("stroke", "black")
                                .attr("stroke-width", 1)
                                .attr("fill", "cyan")
                                .style("opacity", 0);

                            // Fade in / stagger bounce animation
                            dataSite
                                .transition()
                                .delay(function() {
                                    if(!isNaN(site)) {
                                        return 500 * site;
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
        });
});

var plotChart = function() {

    // Append chart group
    var chart = d3.select("svg")
        .append("g")
        .attr("class", "chart");

    // Initialize axis
    var axis = d3.axisBottom(xScale)
        .ticks(5);

    // Append data-rectangle
    var rect = chart.append("rect")
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
        .text("ug/L")
};
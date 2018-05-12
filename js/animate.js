"use strict";
$(document).ready(function () {

    var svg = d3.select("svg");
    var path = d3.geoPath();

    d3.json("data/usa-map.json")
        .then(function (data) {

            // Draw states
            svg.append("g")
                    .attr("class", "states")
                    .attr("transform", "translate(275, 0)")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.states).features)
                .enter().append("path")
                    .attr("d", path)
        })
        .catch(function (reason) {
            console.log(reason);
        })
});

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
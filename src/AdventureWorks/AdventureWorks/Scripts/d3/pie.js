/*
* D3 PieChart Control.
* Encapsulated example from: https://bl.ocks.org/mbostock/3887235
* Licence: GNU General Public License, version 3
* Authors: Mike Bostock, Jovan Popovic
**************************************************************************/

var PieChart = function (target, options) {

    options = options || {};
    this.options = options;
    var _fnGetKey = options.key || function (d) { return d.key; };
    var _fnGetValue = options.value || function (d) { return d.value; };
    var _fnFormat = options.format || function (d) { return d.key + "(" + d.value + ")"; };
    var labelOffset = options.labelOffset || 40;

var svg = d3.select(target),
    width = options.width||0+svg.attr("width"),
    height = options.height||0+svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


//var color = d3.scaleOrdinal(options.colors || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
// Recommended colors: http://www.mulinblog.com/a-color-palette-optimized-for-data-visualization/
var color = d3.scaleOrdinal(options.colors || ["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854"]);

var pie = d3.pie()
    .sort(null)
    .value(function (d) { return _fnGetValue(d); });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(options.innerRadius || 0);

var label = d3.arc()
    .outerRadius(radius - labelOffset)
    .innerRadius(radius - labelOffset);

this.Data = function(data) {
  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color( _fnGetKey(d.data) ); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function (d) { return _fnFormat(d.data); });
}

};
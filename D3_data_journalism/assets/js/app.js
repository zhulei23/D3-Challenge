// Set up the canvas for holding the scatter chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// // Create a SVG wrapper, append an SVG group that will hold the chart, shirt the latter by left and top margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("alignment-baseline", "middle")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append the SVG Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute all data below
d3.csv("assets/data/data.csv").then(function(censusData) {
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create x scale function
  var xScale = d3.scaleLinear()
    .domain([8, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

  // Create y scale
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0])

  // Create axis functions
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);


// Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  chartGroup.append("g")
    .call(yAxis);

// Create Circles
chartGroup.selectAll("circle")
.data(censusData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.poverty))
.attr("cy", d => yScale(d.healthcare))
.attr("r", "12")
.classed("circle", true)
.attr("fill", "green")
.attr("opacity", 0.75);

// Create axes labels
chartGroup.append("g")
  .selectAll('text')
  .data(censusData)
  .enter()
  .append("text")
  .text(d => d.abbr)
  .attr("x", d => xScale(d.poverty))
  .attr("y", d => yScale(d.healthcare))
  .classed(".text", true)
  .attr("font-size", "10px")
  .attr("fill", "white")
  .attr("text-anchor", "middle");
  
  // Append State label onto Circles
  chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("fill", "green")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

        chartGroup.append("text")
        .attr("y", 0 - ((margin.left / 2) + 10))
        .attr("x", 0 - (height / 2))
        .attr("fill", "green")
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Lacks Healthcare (%)");
}).catch(function(error) {
  console.log(error);
});
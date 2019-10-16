var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./assets/data/data.csv").then(function(healthData) {

    healthData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.abbr = data.abbr;
    });

    var xLinearScale = d3.scaleLinear()
      .domain([29, d3.max(healthData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([7, d3.max(healthData, d => d.smokes)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "red")
    .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll("text")
    .exit()
    .data(healthData)
    .enter()
    .append("text")
    .text(function(d){
      return`${d.abbr}`
    })
    .attr("x", d => xLinearScale(d.age)-10)
    .attr("y", d => yLinearScale(d.smokes)+10);

    chartGroup.append("text")
      .attr(`transform`, `rotate(-90)`)
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoking %");

    chartGroup.append("text")
      .attr(`transform`, `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Average Age");
  
    }).catch(function(error) {
    console.log(error);
  });

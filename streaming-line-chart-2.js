// import constructMinMaxTrendTree from "./helper/decoder.js"

// Define the chart dimensions and margins
const margin = { top: 10, right: 40, bottom: 30, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Define the x and y scales and axes
const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Set up the line function for the chart
const line = d3
  .line()
  .x((d) => xScale(d.t))
  .y((d) => yScale(d.v));

// Create the SVG element and append it to the chart container
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let count = 0
let index = 0
let dataset = []
d3.csv("./data/mock_guassian_sin_8m.csv", function(d) {
  return {
      t: +d.t,
      v: +d.v
  };
}).then(function(d) {
  // count = 
  let flag = true
  let isFirst = true
  // Set up the interval to add new data points every 1 second
  setInterval(() => {
    if(flag == true){
      dataset = d.slice(0, 10000)
      flag = false
      index += 10000
    }
    else{
      if(!isFirst){
        dataset.push.apply(dataset,d.slice(index,index+1000))
        dataset.splice(0,1000)
        index = index+1000
      }
      isFirst = false
      updateLineChart();
    }
  }, 100);
});

// Set up the initial line path and data points
const path = svg.append("path").attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5);
const points = svg.selectAll("circle").data(dataset).enter().append("circle").attr("r", 4).attr("fill", "steelblue");

// Set up a function to update the line chart with the current data
const updateLineChart = () => {
  // xScale.domain([dataset.length > 1000 ? dataset.length - 1000 : 0, dataset.length < 1000 ? 1000 : dataset.length]);
  // yScale.domain([0,data.length < 10 ? 100 : d3.max(data, (d) => d.y)]);
    xScale.domain(d3.extent(dataset, d => d.t))
    yScale.domain(d3.extent(dataset,d => d.v))

  // Update the x and y axes
  svg.select(".x.axis").transition().duration(1000).call(xAxis);
  svg.select(".y.axis").transition().duration(1000).call(yAxis);

  // Update the line path and data points
  path.datum(dataset).transition().duration(1000).attr("d", line);
  points.data(dataset).transition().duration(1000).attr("cx", (d) => xScale(d.t)).attr("cy", (d) => yScale(d.v));
};

// Draw the x and y axes
svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis);

// updateLineChart();




//-----------------------------------------------------------------------


// import { constructMinMaxMissTrendTree } from './helper/decoder.js'
import {abcef} from './test'

// Define the chart dimensions and margins
const margin = { top: 10, right: 40, bottom: 30, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Define the x and y scales and axes
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Set up the line function for the chart
const line = d3
  .line()
  .x((d) => xScale(d.time))
  .y((d) => yScale(d.value));

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
d3.csv("./data/BTC-USD.csv", function(d) {
  return {
      time: d3.timeParse("%Y/%m/%d")(d.date),
      value: +d.value
  };
}).then(function(d) {
  // count = 
  let flag = true
  let isFirst = true
  // Set up the interval to add new data points every 1 second
  setInterval(() => {
    if(flag == true){
      dataset = d.slice(0, 2000)
      flag = false
      index += 2000
    }
    else{
      if(!isFirst){
        
        dataset.push.apply(dataset,d.slice(index,index+200))
        dataset.splice(0,200)
        index = index+200
      }
      isFirst = false
      updateLineChart();
    }
  }, 1000);
});

// Set up the initial line path and data points
const path = svg.append("path").attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5);
const points = svg.selectAll("circle").data(dataset).enter().append("circle").attr("r", 4).attr("fill", "steelblue");

// Set up a function to update the line chart with the current data
const updateLineChart = () => {
  // xScale.domain([dataset.length > 1000 ? dataset.length - 1000 : 0, dataset.length < 1000 ? 1000 : dataset.length]);
  // yScale.domain([0,data.length < 10 ? 100 : d3.max(data, (d) => d.y)]);
    xScale.domain(d3.extent(dataset, d => d.time))
    yScale.domain([0, 4000])

  // Update the x and y axes
  svg.select(".x.axis").transition().duration(100).call(xAxis);
  svg.select(".y.axis").transition().duration(1000).call(yAxis);

  // Update the line path and data points
  path.datum(dataset).transition().duration(1000).attr("d", line);
  points.data(dataset).transition().duration(1000).attr("cx", (d) => xScale(d.time)).attr("cy", (d) => yScale(d.value));
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

// Define the chart dimensions and margins
const margin2 = { top: 10, right: 40, bottom: 30, left: 60 };
const width2 = 600 - margin.left - margin.right;
const height2 = 400 - margin.top - margin.bottom;

// Define the x and y scales and axes
const xScale2 = d3.scaleTime().range([0, width]);
const yScale2 = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const xAxis2 = d3.axisBottom(xScale);
const yAxis2 = d3.axisLeft(yScale);

// Set up the line function for the chart
const line2 = d3
  .line()
  .x((d) => xScale(d.time))
  .y((d) => yScale(d.value));

// Create the SVG element and append it to the chart container
const svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let count2 = 0
let index2 = 0
let dataset2 = []
d3.csv("./data/btc_usd2.csv", function(d) {
  return {
      time: d3.timeParse("%Y/%m/%d")(d.date),
      value: +d.value
  };
}).then(function(d) {
  // count = 
  let flag2 = true
  let isFirst2 = true
  // Set up the interval to add new data points every 1 second
  setInterval(() => {
    if(flag2 == true){
      dataset2 = d.slice(0, 1000)
      flag2 = false
      index2 += 1000
    }
    else{
      if(!isFirst2){
        
        dataset2.push.apply(dataset2,d.slice(index2,index2+100))
        dataset2.splice(0,100)
        index2 = index2+100
      }
      isFirst2 = false
      updateLineChart2();
    }
  }, 1000);
});

// Set up the initial line path and data points
const path2 = svg2.append("path").attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5);
const points2 = svg2.selectAll("circle").data(dataset2).enter().append("circle").attr("r", 4).attr("fill", "steelblue");

// Set up a function to update the line chart with the current data
const updateLineChart2 = () => {
  // xScale.domain([dataset.length > 1000 ? dataset.length - 1000 : 0, dataset.length < 1000 ? 1000 : dataset.length]);
  // yScale.domain([0,data.length < 10 ? 100 : d3.max(data, (d) => d.y)]);
    xScale2.domain(d3.extent(dataset2, d => d.time))
    yScale2.domain([0, 4000])

  // Update the x and y axes
  svg2.select(".x.axis").transition().duration(100).call(xAxis2);
  svg2.select(".y.axis").transition().duration(1000).call(yAxis2);

  // Update the line path and data points
  path2.datum(dataset2).transition().duration(1000).attr("d", line2);
  points2.data(dataset2).transition().duration(1000).attr("cx", (d) => xScale2(d.time)).attr("cy", (d) => yScale(d.value));
};

// Draw the x and y axes
svg2
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis2);

svg2.append("g").attr("class", "y axis").call(yAxis2);


// 读取csv文件
d3.csv("./mock_guassian_sin_16.csv").then(function(data) {
    // 转换t和v的类型
    data.forEach(function(d) {
      d.t = +d.t;
      d.v = +d.v;
    });
  
    // 创建x和y轴的比例尺
    const x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.t; }))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.v; }))
      .range([height, 0]);
  
    // 创建折线函数
    const line = d3.line()
      .x(function(d) { return x(d.t); })
      .y(function(d) { return y(d.v); });
  
    // 在SVG中绘制折线图
    const svg = d3.select("svg");
    
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  });
  
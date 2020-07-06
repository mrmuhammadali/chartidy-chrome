function renderBarChart(containerId, labels, data, tWidth) {
  // set the dimensions of the canvas
  const margin = { top: 20, right: 20, bottom: 70, left: 40 };
  const width = tWidth || 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // set the ranges
  const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
  const y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

  // add title
  d3.select(`#${containerId}`)
    .append("h3")
    .attr("class", "chartidy-title")
    .html(`${labels.x} vs ${labels.y}`);

  // add the SVG element
  var svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // scale the range of the data
  x.domain(data.map((d) => d.x));
  y.domain([0, d3.max(data, (d) => d.y)]);

  // add axis
  svg
    .append("g")
    .attr("class", "x chartidy-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg
    .append("g")
    .attr("class", "y chartidy-axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 2)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(labels.y);

  // Add bar chart
  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "chartidy-bar")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("width", x.rangeBand())
    .attr("y", function (d) {
      return y(d.y);
    })
    .attr("height", function (d) {
      return height - y(d.y);
    });
}

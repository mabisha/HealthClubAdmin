
var url_string = window.location.href;
var url = new URL(url_string)
var id = url.searchParams.get("id");
console.log(id)

let http = new XMLHttpRequest;
let athletes = null

//get data from json file
http.open('get', 'athletes.json', true);

http.send();

http.onload = function () {
  // checking if http is ready 
  if (this.readyState == 4 && this.status == 200) {
    athletes = JSON.parse(this.responseText);

    let output1 = "";

    // reading the value of json
    for (let item of athletes) {
      if (id == item.id) {
        output1 += `
            
                <img src="${item.image}" class="image" width="150" height="100">
                 <p>Name:${item.name}</p>
                 <p>Email:${item.email}</p>`
      }
    }
    document.querySelector(".athlete_image").innerHTML = output1;
  }
}

// ploting the graph starts

// setting the margin for svg graph
var margin = { top: 50, right: 20, bottom: 70, left: 100 },
  width = 760 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// Append the svg object to the page
var svg = d3.select(".plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// Parse the CSV file using Papa.parse
Papa.parse("HCP_benchmark_data.csv", {
  download: true,
  header: true,
  delimiter: ",",
  dynamicTyping: true,
  complete: function (results) {

    // Extract the values for the x-axis from the CSV data
    var data = results.data.slice(1);
    var values = results.data.map(function (d) {
      return d.cortexgraymatter;
    });

    // calculate mean and standard devaition
    var mean = d3.mean(values);
    var deviation = d3.deviation(values);
    //console.log(deviation);

    // Compute the normal probability density function for each x-value 
    function normalPdf(x) {
      var numerator = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(deviation, 2)));
      var denominator = deviation * Math.sqrt(2 * Math.PI);
      return (numerator / denominator);
    }
    // Compute the y-values for the normal probability density function
    var yValues = values.map(function (d) {
      var y = normalPdf(d);
      return y;
    });

    // Compute the maximum y-value for scaling the y-axis
    var maxYValue = d3.max(yValues);
    console.log(maxYValue)

    // Create the x-axis scale and axis
    var xScale = d3.scaleLinear()
      .domain([d3.min(values), d3.max(values)])
      .range([0, width]);
    console.log(xScale)
    var xAxis = d3.axisBottom(xScale);

    // Create the y-axis scale and axis
    var yScale = d3.scaleLinear()
      .domain([0, maxYValue])
      .range([height, 0]);

    var yAxis = d3.axisLeft(yScale);

    // Add the x-axis to the SVG
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the y-axis to the SVG
    svg.append("g")
      .call(yAxis);

    // Add the x-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Data");

    // Add y-axis label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Data");

    // Create a line generator for the bell curve
    var line = d3.line()
      .x(function (d) { return xScale(d[0]); })
      .y(function (d) { return yScale(d[1]); });

    // Create an array of [x, y] coordinate pairs for the bell curve
    var curveData = values.map(function (d, i) {
      return [d, yValues[i]];
    });

    // Add the bell curve to the SVG
    svg.append("path")
      .datum(curveData)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", "#2671977c")
      .style("stroke", "#0f5679")

  }
});


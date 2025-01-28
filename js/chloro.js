const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPpPEMhMb0ze6VNLahAgrkP225up-FEZl01dLiN4Dj6kEUh3jEo_4u6PLd9-4ffDJOQR7mS6RgRO5N/pub?gid=481055528&single=true&output=csv"
const csvUrl2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPpPEMhMb0ze6VNLahAgrkP225up-FEZl01dLiN4Dj6kEUh3jEo_4u6PLd9-4ffDJOQR7mS6RgRO5N/pub?gid=7259390&single=true&output=csv";
   
// The svg

const element = d3.select('#map');

const width = element.node().clientWidth;
const height = element.node().clientHeight;

//const width = 400, height = 400;
const svg = d3.select("#map")
              .append("svg")
              .style("width", width)
              .style("height", height);
  //width = +svg.attr("width"),
  //height = +svg.attr("height");



// Map and projection

const path = d3.geoPath();

//const projection = d3.geoEquirectangular()
  //.scale(10)
  //.center([0,0])
  //.translate([width / 2, height / 2]);


// Data and color scale

let data = new Map()

var getMax1 = function (someMap) {
      console.log(typeof someMap);
      let arr = Object.values(someMap);
      let max = Math.max(...arr);
      return max
      var maxValue;
      for (var [key, value] of someMap) {
         maxValue = (!maxValue || maxValue < value) ? value : maxValue;
      }
      return maxValue;
    }

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
//d3.csv(csvUrl, function(d) {
//    data.set(d.country, +d.count)
//})
d3.csv(csvUrl2).then(data => {
  
  countryCounts = data.reduce((acc, d) => {
      acc[d.Global_region] = (acc[d.Global_region] || 0) + 1;
      return acc;
  }, {})})
]).then(function(loadData){
    let topo = loadData[0];
    console.log(countryCounts);


var colorScale = d3.scaleSqrt()
  .domain([0,getMax1(countryCounts)])
  .range([0,1]);

const projection = d3.geoEquirectangular()
  .fitSize([width, height], topo);

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(500)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(500)
      .style("opacity", 1)
      .attr("stroke-opacity","1")
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .attr("stroke-opacity","0")
      .style("stroke", "transparent")
  }


    // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = countryCounts[d.properties.name] || 0;
        return d3.interpolateInferno(colorScale(d.total));
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover",(event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.properties.name}: ${d.total}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        // Highlight the hovered bar and remove other labels
        svg.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8)
      })
      .on("mouseout", mouseLeave )
      //.on("mouseover", mouseOver )
})
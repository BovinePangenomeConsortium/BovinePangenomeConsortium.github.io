const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPpPEMhMb0ze6VNLahAgrkP225up-FEZl01dLiN4Dj6kEUh3jEo_4u6PLd9-4ffDJOQR7mS6RgRO5N/pub?gid=7259390&single=true&output=csv";
   
// The svg
const element = d3.select('#map');
const width = element.node().clientWidth;
const height = element.node().clientHeight;

const svg = element
  .append("svg")
  .style("width", width)
  .style("height", height);

// Map and projection
const path = d3.geoPath();

var getMax1 = function (someMap) {
  let arr = Object.values(someMap);
  return Math.max(...arr);
}

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv(csvUrl).then(data => {
  
  countryCounts = data.reduce((acc, d) => {
    acc[d['Global region']] = (acc[d['Global region']] || 0) + 1;
    return acc;
  }, {});
  countryCounts2 = data.reduce((acc, d) => {
  acc[d.Origin] = (acc[d.Origin] || 0) + 1;
  return acc;
  }, {});
  countryCounts3 = data.reduce((acc, d) => {
    acc[d.Contributor_origin] = (acc[d.Origin] || 0) + 1;
    return acc;
}, {});
})
]).then(function(loadData){
    let topo = loadData[0];

const projection = d3.geoEquirectangular()
  .fitSize([width, height], topo);

  const dataOptions = ["Breed origin", "Animal origin", "Contributor origin"];

  // Append dropdown to the body and populate it
  const dropdown = d3.select("#dropdown")
      .on("change", function(event) {
          const selectedValue = d3.select(event.target).property("value");
          updateVisualization(selectedValue);
      });

  dropdown.selectAll("option")
      .data(dataOptions)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);

  function updateVisualization(selectedValue) {
    let color_feature = ""
    if (selectedValue == "Breed origin") {
      color_feature = countryCounts;
    }
    else if (selectedValue == "Animal origin") {
      color_feature = countryCounts2;
    }
    else if (selectedValue == "Contributor origin") {
      color_feature = countryCounts3;
    }

  var colorScale = d3.scaleSqrt()
    .domain([0,getMax1(color_feature)])
    .range([0,1]);

    drawMap(svg, topo, color_feature, projection, colorScale);
}
const setCountryStyle = (selection, opacity, strokeOpacity, strokeColor) => {
  selection
    .transition()
    .duration(200)
    .style("opacity", opacity)
    .attr("stroke-opacity", strokeOpacity)
    .style("stroke", strokeColor);
};

const drawMap = (svg, topo, colorFeature, projection, colorScale) => {
  svg.selectAll("*").remove(); 
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      .attr("d", d3.geoPath().projection(projection))
      .attr("fill", d => {
        d.total = colorFeature[d.properties.name] || 0;
        return d3.interpolateInferno(colorScale(d.total));
      })
      .style("stroke", "transparent")
      .attr("class", "Country")
      .style("opacity", 0.8)
      .on("mouseover",(event, d) => {      
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.properties.name}: ${d.total}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
      d3.selectAll(".Country").call(setCountryStyle, 0.2, null, null);
      d3.select(event.target).call(setCountryStyle, 1, "1", "black");

      })
      .on("mouseleave", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0);
        d3.selectAll(".Country").call(setCountryStyle, 0.8, null, null);
      }) 
}
updateVisualization(dataOptions[0]);
})
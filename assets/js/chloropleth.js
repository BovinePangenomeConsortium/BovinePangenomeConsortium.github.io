const csvUrl = window.location.hostname=="localhost" ? "/assets/data/BPC.csv" : "/BovinePangenome.github.io/assets/data/BPC.csv"
const jsonUrl = window.location.hostname=="localhost" ? "/assets/data/world.geojson" : "/BovinePangenome.github.io/assets/data/world.geojson" 

function colorbar(scale, width, height) {

    var tickValues = scale.domain(),
        axisGroup = null;
    var linearScale = d3.scaleLinear()
        .domain(scale.domain())
        .range([0, width ]);
    var barThickness = height;
    var barRange =  width;

    function colorbar(context) {
        // The finer, the more continuous it looks
        var dL = 1;
        var nBars = Math.floor(barRange / dL);
        var barData = [];
        var trueDL = barRange * 1. / nBars;
        for (var i = 0; i < nBars; i++) {
            barData.push(i/nBars);
        }

        var interScale = d3.scaleLinear()
            .domain([0, barRange])
            .range(scale.range());

        var bars = context.selectAll("rect")
            .data(barData)
            .enter()
            .append("rect")
            .attr("x", function(d,i) { return 20 + i;})
            .attr("y", 250)
            .attr("width", trueDL)
            .attr("height", barThickness)
            .style("stroke-width", "0px")
            .style("fill", function (d, i) {
                return d3.interpolateInferno(d)
            });

        var myAxis = d3.axisBottom(linearScale);
        if (tickValues == null) tickValues = myAxis.tickValues();
        else myAxis.tickValues(tickValues);
        axisGroup = context.append("g")
            .attr("class", "colorbar axis")
            .attr("transform", "translate(20,"+(250+barThickness)+")").call(myAxis).selectAll(".tick").data(tickValues);
    }
    colorbar.tickValues = function (_) {
        return arguments.length ? (tickValues = _, colorbar) : tickValues;
    };
    return colorbar;
}


// The svg
const element = d3.select('#map');
const width = element.node().clientWidth;
const height = element.node().clientHeight;

const svg = element
  .append("svg")
  .attr("width", width)
  .attr("height", height);

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
d3.json(jsonUrl),
d3.csv(csvUrl).then(data => {
  countryCounts = data.reduce((acc, d) => {
    if (d['Global region']) {
    	acc[d['Global region']] = (acc[d['Global region']] || 0) + 1;
    }
    return acc;
  }, {});
  countryCounts2 = data.reduce((acc, d) => {
    if(d['Sample origin']) {
      acc[d['Sample origin']] = (acc[d['Sample origin']] || 0) + 1;
    }
    return acc;
  }, {});
  countryCounts3 = data.reduce((acc, d) => {
    if (d['Contributor location']) {
      acc[d['Contributor location']] = (acc[d['Contributor location']] || 0) + 1;
    }
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
      var cb = colorbar(colorScale, 150,10);
      svg.append("g")
        .call(cb);
}
updateVisualization(dataOptions[0]);
})

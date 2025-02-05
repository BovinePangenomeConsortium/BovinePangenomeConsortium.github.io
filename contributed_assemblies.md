---
title:  "The BPC's assemblies"
ext-js: "https://d3js.org/d3.v7.min.js"
js: ["/assets/js/chloropleth.js","/assets/js/barplot.js"]
css: "/assets/css/d3.css"
---

The BPC has collated a large number of assemblies from the numerous **contributing collaborators**.
These are just some interesting ways to visualise some of that data. This page uses [d3.js](https://d3js.org/), so it may take a few seconds to fully render.


### Global distribution of the BPC

We can assess this by the

 - approximate country of origin for that breed ("Breed origin")
 - where the animal itself was from ("Animal origin")
 - where the contributing collaborator was from ("Contributor origin")

Warmer colours indicate higher counts on the "inferno" colourscale.

<label for="dropdown">Select an option:</label>
<select id="dropdown"></select>
<div class="map" id="map"></div>

### Breakdown by breed

We can also look at how many assemblies we have per breed. The different colours represent different subspecies

<div class="chart" id="chart"></div>



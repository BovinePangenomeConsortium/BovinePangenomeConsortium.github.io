---
title:  "D3.js in Jekyll Markdown"
date:   2017-01-02 15:00:00
categories: [code]
tags: [code, d3js]
ext-js: "https://d3js.org/d3.v7.min.js"
js: "js/chloro.js"
css: "css/d3.css"
---
I've used d3.select to target an element `<div id="example">` in this document:


<div class="map" id="map"></div>

Things to keep in mind:

* Include morley.csv (Search local JavaScript for `/morley.csv`)
* Include D3.js
* Include box.js
* Include the local CSS and JavaScript

Check out [the code for this post on GitHub](https://raw.githubusercontent.com/dancole/dancole.github.io/master/_posts/2017-01-02-d3js-example.markdown).

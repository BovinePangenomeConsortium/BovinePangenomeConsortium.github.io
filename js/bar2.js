   const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPpPEMhMb0ze6VNLahAgrkP225up-FEZl01dLiN4Dj6kEUh3jEo_4u6PLd9-4ffDJOQR7mS6RgRO5N/pub?gid=7259390&single=true&output=csv";
        // Set dimensions and margins for the chart
        const margin = { top: 20, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Load data from the CSV file
        d3.csv(csvUrl).then(data => {
            // Calculate occurrences of each breed
            const breedCounts = data.reduce((acc, d) => {
                acc[d.Breed] = (acc[d.Breed] || 0) + 1;
                return acc;
            }, {});

                // Create a color scale based on species
                const colorScale = d3.scaleOrdinal()
                .domain(data.map(d => d.Species))
                .range(d3.schemeTableau10);
               
                // Convert breedCounts object into an array of objects for D3
                const formattedData = Object.entries(breedCounts).map(([breed, count]) => ({
                breed: breed,
                count: count,
                species: data.find(d => d.Breed === breed)?.Species || "Unknown"
                })).sort((a, b) => a.breed.localeCompare(b.breed)); // Sort alphabetically by category

            // Set scales
            const x = d3.scaleBand()
                .domain(formattedData.map(d => d.breed)) // Assume 'category' column exists
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, d3.max(formattedData, d => d.count)])
                .nice()
                .range([height, 0]);

            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add bars
            svg.selectAll(".bar")
                .data(formattedData)
                .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.breed))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .attr("fill", d => colorScale(d.species))
                .on("mouseover", (event, d) => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`<em>${d.species}</em><br>${d.breed}: ${d.count}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");

                    // Highlight the hovered bar and remove other labels
                    svg.selectAll(".bar")
                        .attr("opacity", b => b.breed === d.breed ? 1 : 0.15);

                    svg.selectAll("g.tick text")
                        .style("opacity", b => b === d.breed ? 1 : 0.15);
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(500).style("opacity", 0);

                    // Reset bar and label opacity
                    svg.selectAll(".bar")
                        .attr("opacity", 1);

                    svg.selectAll("g.tick text")
                        .style("opacity", 1);
                });

            // Add axis labels
            svg.append("text")
                .attr("class", "axis-label")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .attr("text-anchor", "middle")
                .text("Breeds");

            svg.append("text")
                .attr("class", "axis-label")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 15)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text("Number of assemblies");
        });
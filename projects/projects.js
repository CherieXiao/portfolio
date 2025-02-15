import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
  
let sliceGenerator = d3.pie().value((d) => d.value);
  
let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
let arcData = sliceGenerator(data);
  
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);
  
let svg = d3.select('svg');
  
arcData.forEach((slice, idx) => {
  svg.append('path')
    .attr('d', arcGenerator(slice))
    .attr('fill', colors(idx));
});
  
let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`)
          .attr('class', 'legend')
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
})
  
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);


  
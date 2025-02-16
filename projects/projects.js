import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

let query = '';
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  
  const filteredProjects = projects.filter(project => {
    return Object.values(project).join(' ').toLowerCase().includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

function renderPieChart(projectsGiven) {
  d3.select('svg').selectAll('*').remove();
  d3.select('.legend').selectAll('li').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );
  
  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  const colors = d3.scaleOrdinal(d3.schemeTableau10); // Fresh color scale
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  arcData.forEach((slice, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arcGenerator(slice))
      .attr('fill', colors(idx));
  });

  const legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}
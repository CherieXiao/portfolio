import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedYear = -1;

updateDisplay();

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  updateDisplay();
});

function getFilteredProjects() {

  const searchFiltered = projects.filter(project => {
    return Object.values(project)
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  return selectedYear !== -1 
    ? searchFiltered.filter(p => p.year === selectedYear)
    : searchFiltered;
}

function updateDisplay() {
  const finalFiltered = getFilteredProjects();
  
  projectsTitle.textContent = `${finalFiltered.length} Projects`;
  renderProjects(finalFiltered, projectsContainer, 'h2'); 

  const searchFiltered = projects.filter(project => {
    return Object.values(project)
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
  
  renderPieChart(searchFiltered);
}

function renderPieChart(projectsToVisualize) {
  d3.select('#pie-chart').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  const yearCounts = d3.rollups(
    projectsToVisualize,
    v => v.length,
    d => d.year
  );

  const pieData = yearCounts.map(([year, count]) => ({
    year,
    count,
    selected: year === selectedYear
  }));

  const color = d3.scaleOrdinal(d3.schemeTableau10);
  const pie = d3.pie().value(d => d.count);
  const arcs = pie(pieData);
  const arc = d3.arc().innerRadius(0).outerRadius(45);

  const svg = d3.select('#pie-chart');

  svg.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i))
    .classed('selected', d => d.data.selected)
    .on('click', (event, d) => {
      selectedYear = d.data.selected ? -1 : d.data.year;
      updateDisplay();
    });

  const legend = d3.select('.legend');
  pieData.forEach((d, i) => {
    legend.append('li')
      .classed('selected-legend', d.selected)
      .html(`<span class="swatch" style="background:${color(i)}"></span> ${d.year} (${d.count})`)
      .on('click', () => {
        selectedYear = d.selected ? -1 : d.year;
        updateDisplay();
      });
  });
}
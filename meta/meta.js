let data = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    processCommits();
    displayStats();
    createScatterplot();
  }

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

let commits = d3.groups(data, (d) => d.commit);

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
      });
  }

  function displayStats() {
      const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
      dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
      dl.append('dd').text(data.length);
  
      const uniqueCommits = new Set(data.map(d => d.commit)).size;
      dl.append('dt').text('Total commits');
      dl.append('dd').text(uniqueCommits);

      const uniqueFiles = new Set(data.map(d => d.file)).size;
      dl.append('dt').text('Number of files');
      dl.append('dd').text(uniqueFiles);
  
      const maxFileLength = d3.max(data, d => d.line);
      dl.append('dt').text('Maximum file length');
      dl.append('dd').text(maxFileLength);
  
      const fileLengths = d3.rollups(data, v => d3.max(v, d => d.line), d => d.file);
      const avgFileLength = d3.mean(fileLengths, d => d[1]).toFixed(2);
      dl.append('dt').text('Average file length');
      dl.append('dd').text(avgFileLength);
  
      const maxDepth = d3.max(data, d => d.depth);
      dl.append('dt').text('Maximum depth');
      dl.append('dd').text(maxDepth);
  
      const avgDepth = d3.mean(data, d => d.depth).toFixed(2);
      dl.append('dt').text('Average depth');
      dl.append('dd').text(avgDepth);
  
      const commitsByDay = d3.rollups(data, v => v.length, d => d.datetime.getDay());
      const mostActiveDay = d3.greatest(commitsByDay, d => d[1])[0];
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      dl.append('dt').text('Most active day of the week');
      dl.append('dd').text(days[mostActiveDay]);

      const workByPeriod = d3.rollups(data, v => v.length, d => d.datetime.toLocaleString('en', { dayPeriod: 'short' }));
      const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
      dl.append('dt').text('Time of day with most commits');
      dl.append('dd').text(maxPeriod);
  }

function createScatterplot() {
    const width = 1000;
    const height = 600;
    
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
    
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([0, width])
      .nice();
    
    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
    
    const dots = svg.append('g').attr('class', 'dots');
    
    dots
      .selectAll('circle')
      .data(commits)
      .join('circle')
      .attr('cx', (d) => xScale(d.datetime))
      .attr('cy', (d) => yScale(d.hourFrac))
      .attr('r', 5)
      .attr('fill', 'steelblue'); 
    
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
      };
      
    // Update scales with new ranges
    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);

    const gridlines = svg
        .append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

// Create gridlines as an axis with no labels and full-width ticks
gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    // Create the axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
        .axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

    // Add X axis
    svg
        .append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis);

    // Add Y axis
    svg
        .append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);


}

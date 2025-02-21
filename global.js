console.log('IT’S ALIVE!');


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'projects' },
  { url: 'contact/', title: 'contact' },
  { url: 'CV/', title: 'CV' },
  { url: 'meta/', title: 'meta' },
  { url: 'https://github.com/CherieXiao', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	  <label class="color-scheme">
		    Theme:
		    <select>
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
		    </select>
	  </label>`
);


const select = document.querySelector('.color-scheme select');

if ('colorScheme' in localStorage) {
  const storedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', storedScheme);
  select.value = storedScheme;
}

select.addEventListener('input', function (event) {
  const selectedScheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', selectedScheme);
  localStorage.colorScheme = selectedScheme;
});


export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement) {
  containerElement.innerHTML = '';

  projects.forEach((project) => {

    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${project.title}</h2>
      <img src="${project.image}" alt="${project.title}" />
      <div class="project-info">
        <p>${project.description}</p>
        <p class="project-year">Year: ${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  try {
      const data = await fetchJSON(`https://api.github.com/users/${username}`);
      if (!data) throw new Error('No data returned');
      return data;
  } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      return null;
  }
}



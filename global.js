console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add('current');

let pages = [
  { url: '/portfolio/', title: 'Home' },
  { url: '/portfolio/projects/', title: 'Projects' },
  { url: '/portfolio/contact/', title: 'Contact' },
  { url: '/portfolio/CV/', title: 'CV' },
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


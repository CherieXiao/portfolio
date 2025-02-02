import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function init() {

    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');
}
init();

async function loadGitHubStats() {
    const githubData = await fetchGitHubData('CherieXiao');
    const profileStats = document.querySelector('#profile-stats');

    if (!githubData || !profileStats) {
        console.error('Failed to load GitHub data or element not found');
        return;
    }

    profileStats.innerHTML = `
        <h2>My GitHub Stats</h2>
        <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

loadGitHubStats();